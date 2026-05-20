import { LuTicketX } from "react-icons/lu";

export default function TicketNotFound() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-10 flex flex-col items-center gap-4 text-center">
        <LuTicketX className="h-14 w-14 text-gray-300" />
        <h1 className="text-xl font-bold text-gray-800">Ticket not found</h1>
        <p className="text-sm text-gray-400">
          This link is invalid or the ticket no longer exists.
        </p>
      </div>
    </main>
  );
}
