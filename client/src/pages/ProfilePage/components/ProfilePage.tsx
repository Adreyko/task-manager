import { useInitUser } from '@/entities/User/api/userApi';

const ProfilePage = () => {
  const { data: user, isLoading, isError } = useInitUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <div>Error loading profile. Please try again later.</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <div>
        <strong>Username:</strong> {user.username}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
       <div>
        <strong>First Name:</strong> {user.firstName}
      </div>
       <div>
        <strong>Last Name:</strong> {user.lastName}
      </div>
    </div>
  );
};

export default ProfilePage;
