import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client/react';
import { BodySection } from '../../components/Layouts/BodySection';
import {
  InputField,
  Button,
  Avatar,
  baseColors,
  baseVibrantColors,
  mediaQueries
} from 'phantomartist';
import { Camera02Icon } from 'hugeicons-react';
import { CSSObject } from '@emotion/react';
import { CHANGE_PASSWORD, UPDATE_PROFILE } from '../../api/mutations';

const ProfilePage = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    displayName: '',
    birthday: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    avatarUrl: ''
  });
  const user = localStorage.getItem('baphomet-user')
    ? JSON.parse(localStorage.getItem('baphomet-user') || '{}')
    : null;

  const [updateProfile] = useMutation(UPDATE_PROFILE);
  const [changePassword] = useMutation(CHANGE_PASSWORD);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        id: user.id || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        displayName: user.displayName || '',
        birthday: user.birthday || '',
        avatarUrl: user.avatarUrl || ''
      }));
    }
  }, []);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAvatarChange = () => {
    console.log('Avatar change handler not implemented yet');
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ variables: { ...formData } });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword({ variables: { ...formData } });
  };

  const handleCancel = () => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        displayName: user.displayName || '',
        birthday: user.birthday || '',
        avatarUrl: user.avatarUrl || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
    }
    setErrors({});
  };

  return (
    <BodySection>
      <h1>Profile Settings</h1>

      <div css={baphStyles.pageLayout}>
        {/* Avatar Section - Left Side */}
        <div css={baphStyles.avatarColumn}>
          <div css={baphStyles.avatarWrapper}>
            <Avatar
              displayName={formData.displayName || formData.username || 'User'}
              imageUrl={formData.avatarUrl}
              size={120}
            />
            <label htmlFor="avatar-upload" css={baphStyles.cameraIconWrapper}>
              <Camera02Icon size={24} />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                css={baphStyles.avatarInput}
                onChange={handleAvatarChange}
              />
            </label>
          </div>
        </div>

        {/* Form Section - Right Side */}
        <div css={baphStyles.formColumn}>
          <form onSubmit={handleProfileSubmit} noValidate>
            {/* Personal Information */}
            <div css={baphStyles.formFieldContainers}>
              <h3 css={baphStyles.sectionHeading}>Personal Information</h3>

              <InputField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleFieldChange}
                error={errors.username}
                required
                size="medium"
                onDark
              />

              <InputField
                label="Display Name"
                name="displayName"
                value={formData.displayName}
                onChange={handleFieldChange}
                error={errors.displayName}
                size="medium"
                onDark
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleFieldChange}
                error={errors.email}
                required
                size="medium"
                onDark
              />
              <InputField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleFieldChange}
                error={errors.firstName}
                size="medium"
                onDark
              />
              <InputField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleFieldChange}
                error={errors.lastName}
                size="medium"
                onDark
              />
              <InputField
                label="Birthday"
                name="birthday"
                type="date"
                value={formData.birthday || ''}
                onChange={handleFieldChange}
                error={errors.birthday}
                size="medium"
                onDark
              />
            </div>

            {/* Profile Action Buttons */}
            <div css={baphStyles.profileButtonContainer}>
              <Button type="submit" size="medium" variant="secondary">
                Save Profile
              </Button>
              <Button
                type="button"
                size="medium"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>

          <hr css={baphStyles.divider} />

          {/* Password Section */}
          <form>
            <div css={baphStyles.passwordSection}>
              <h3 css={baphStyles.sectionHeading}>Change Password</h3>
              <p css={baphStyles.sectionDescription}>
                Enter your current password and choose a new one to update your
                password.
              </p>

              <div css={baphStyles.passwordFields}>
                <InputField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleFieldChange}
                  error={errors.currentPassword}
                  autoComplete="current-password"
                  size="medium"
                  onDark
                />
                <InputField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleFieldChange}
                  error={errors.newPassword}
                  autoComplete="new-password"
                  size="medium"
                  onDark
                />
                <InputField
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  value={formData.confirmNewPassword}
                  onChange={handleFieldChange}
                  error={errors.confirmNewPassword}
                  autoComplete="new-password"
                  size="medium"
                  onDark
                />
              </div>

              {/* Password Save Button */}
              <div css={baphStyles.passwordButtonContainer}>
                <Button
                  size="medium"
                  variant="secondary"
                  onClick={handlePasswordSubmit}
                  disabled={
                    !formData.currentPassword ||
                    !formData.newPassword ||
                    !formData.confirmNewPassword
                  }
                >
                  Change Password
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </BodySection>
  );
};

const baphStyles: { [key: string]: CSSObject } = {
  pageLayout: {
    display: 'flex',
    gap: '2rem',
    flexDirection: 'column',
    [mediaQueries.minWidth.md]: {
      flexDirection: 'row'
    }
  },
  avatarColumn: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    [mediaQueries.minWidth.md]: {
      flex: '0 0 200px'
    }
  },
  formColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '600px'
  },
  formContainer: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  formFieldContainers: {
    display: 'flex',
    gap: '2rem',
    flexDirection: 'column',
    marginBottom: '1.5rem'
  },
  profileButtonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-start'
  },
  passwordButtonContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-start'
  },
  divider: {
    borderTop: `1px solid ${baseColors.tertiary[500]}`,
    width: '100%',
    margin: '2rem 0'
  },
  sectionHeading: {
    color: baseVibrantColors.primary[300],
    fontSize: '1.25rem',
    fontWeight: 'bold',
    margin: '0 0 1rem 0'
  },
  sectionDescription: {
    color: baseColors.tertiary[300],
    fontSize: '0.875rem',
    margin: '0 0 1rem 0',
    fontStyle: 'italic'
  },
  avatarWrapper: {
    position: 'relative',
    width: 120,
    height: 120
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
    cursor: 'pointer',
    color: baseColors.primary[100],
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  avatarInput: {
    display: 'none'
  },
  passwordSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  passwordFields: {
    display: 'flex',
    gap: '1rem',
    flexDirection: 'column',
    [mediaQueries.minWidth.md]: {
      flexDirection: 'column'
    }
  }
};

export default ProfilePage;
