export default function UserNavbar({ user }) {
  // console.log(user);
  const displayName = user.display_name;
  const initials = displayName.substring(0, 2).toUpperCase();
  return (
    <div className="flex items-center space-x-3">
      <div className="relative group">
        <span className="bg-indigo-500 rounded-full h-9 w-9 flex items-center justify-center text-sm font-bold cursor-pointer">
          {initials}
        </span>
      </div>
      <span className="font-medium text-white text-sm">{displayName}</span>
    </div>
  );
}
