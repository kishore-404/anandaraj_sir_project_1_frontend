

interface NavbarProps {
  onLogout: () => void;
}

export function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow px-6 py-3 flex justify-between none md:block items-center">
      <h2 className="text-xl font-bold text-gray-700">📚 Smart LMS Admin</h2>
      <button
        onClick={onLogout}
        className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </nav>
  );
}
