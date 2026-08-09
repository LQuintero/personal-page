import ContactForm from '@/components/ContactForm';
import NavBar from '@/components/NavBar';

export default function Contact() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavBar />
      <div className="flex flex-1 min-h-0 items-center justify-center overflow-y-auto px-4 py-4 sm:py-6">
        <ContactForm />
      </div>
    </div>
  );
}