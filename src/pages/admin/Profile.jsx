import { useEffect, useState } from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from 'firebase/auth';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { formatDateLong } from '@/utils/formatDate';
import { useToast } from '@/components/ui/Toast';
import { updateAdmin } from '@/services/firestore/adminService';
import { uploadImageToImageKit } from '@/services/imagekit/imagekitService';

const Profile = () => {
  const { user, adminData, signOut } = useAuth();
  const { addToast } = useToast();
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const avatarSrc = avatarPreview || adminData?.avatarUrl || '';
  const initials = (adminData?.name || 'A')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => () => {
    if (avatarPreview.startsWith('blob:')) URL.revokeObjectURL(avatarPreview);
  }, [avatarPreview]);

  const onAvatarFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : '');
  };

  const onUploadAvatar = async () => {
    if (!avatarFile) {
      addToast({ variant: 'warning', message: 'Please select an image first.' });
      return;
    }

    if (!adminData?.id) {
      addToast({ variant: 'error', message: 'Admin profile not found.' });
      return;
    }

    setAvatarUploading(true);
    try {
      const upload = await uploadImageToImageKit(avatarFile, {
        folder: '/admins/avatars',
        fileName: `${Date.now()}-${avatarFile.name}`
      });

      await updateAdmin(adminData.id, {
        avatarUrl: upload.url || ''
      });

      setAvatarFile(null);
      setAvatarPreview('');
      addToast({ variant: 'success', message: 'Avatar updated successfully. Please refresh if it does not appear immediately.' });
    } catch (err) {
      addToast({ variant: 'error', message: err.message || 'Unable to update avatar.' });
    } finally {
      setAvatarUploading(false);
    }
  };

  const onChangePassword = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (values.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      setError('Password confirmation does not match.');
      return;
    }

    if (!user?.email) {
      setError('Authenticated user email not available.');
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);
      setMessage('Password updated successfully.');
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      addToast({ variant: 'success', message: 'Logged out successfully.' });
    } catch (err) {
      addToast({ variant: 'error', message: err.message || 'Unable to logout.' });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-4xl text-text">My Profile</h2>

      <Card className="space-y-3 p-6">
        <div className="mb-2 flex flex-wrap items-center gap-4">
          {avatarSrc ? (
            <img src={avatarSrc} alt={adminData?.name || 'Admin avatar'} className="h-20 w-20 rounded-full border border-border object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-surface-2 font-heading text-xl text-text">
              {initials}
            </div>
          )}
          <div className="flex min-w-[220px] flex-1 flex-wrap items-end gap-2">
            <Input
              label="Update Avatar"
              type="file"
              accept="image/*"
              className="py-2"
              onChange={onAvatarFileChange}
            />
            <Button type="button" variant="secondary" onClick={onUploadAvatar} loading={avatarUploading} disabled={!avatarFile}>
              Save Avatar
            </Button>
          </div>
        </div>
        <p><span className="font-medium">Name:</span> {adminData?.name || 'N/A'}</p>
        <p><span className="font-medium">Email:</span> {user?.email || 'N/A'}</p>
        <p><span className="font-medium">Role:</span> {adminData?.role || 'Admin'}</p>
        <p><span className="font-medium">Status:</span> <Badge variant={adminData?.isActive ? 'success' : 'danger'}>{adminData?.isActive ? 'Active' : 'Inactive'}</Badge></p>
        <p><span className="font-medium">Created At:</span> {formatDateLong(adminData?.createdAt)}</p>
      </Card>

      <Card className="p-6">
        <h3 className="font-heading text-3xl text-text">Change Password</h3>
        <form className="mt-4 space-y-4" onSubmit={onChangePassword}>
          <Input label="Current Password" type="password" value={values.currentPassword} onChange={(event) => setValues((prev) => ({ ...prev, currentPassword: event.target.value }))} required />
          <Input label="New Password" type="password" value={values.newPassword} onChange={(event) => setValues((prev) => ({ ...prev, newPassword: event.target.value }))} required />
          <Input label="Confirm New Password" type="password" value={values.confirmPassword} onChange={(event) => setValues((prev) => ({ ...prev, confirmPassword: event.target.value }))} required />
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button type="submit" loading={loading}>Update Password</Button>
        </form>
      </Card>

      <Button variant="danger" onClick={handleLogout}>Logout</Button>
    </div>
  );
};

export default Profile;
