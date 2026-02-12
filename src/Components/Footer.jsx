export default function Footer() {
  return (
    <footer className="py-4 border-t border-gray-200 bg-gray-100">
      <p className="text-center text-xs text-gray-500 tracking-wide">
        © {new Date().getFullYear()} CodeIt — All Rights Reserved
      </p>
    </footer>
  )
}
