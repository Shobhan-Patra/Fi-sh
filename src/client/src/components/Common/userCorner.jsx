export default function UserNavbar({ user }) {
  return (
    <div className="w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <h1 className="text-xl font-bold">Fi-sh</h1>
      <div className="flex items-center space-x-3">
        <span className="hidden sm:inline">{user.userDisplayName}</span>
        <div className="relative group">
          <span className="bg-indigo-500 rounded-full h-9 w-9 flex items-center justify-center text-sm font-bold cursor-pointer">
            {user.userDisplayName.substring(0, 2).toUpperCase()}
          </span>
          {/* Tooltip for mobile or when name is hidden */}
          <div className="absolute top-full mt-2 right-0 w-max px-3 py-1.5 text-sm font-semibold text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none sm:hidden">
            {user.userDisplayName}
          </div>
        </div>
      </div>
    </div>
  );
}