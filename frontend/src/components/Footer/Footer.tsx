export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white p-6 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          © {new Date().getFullYear()} YourStore. All rights reserved.
        </div>
      </footer>
    );
  }
  