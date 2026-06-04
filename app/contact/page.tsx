import ContactForm from '@/components/ContactForm';
import NavBar from '@/components/NavBar';

export default function Contact() {
  return (
    <div className="flex flex-col">
      <NavBar />
      <div className="flex justify-center pt-16 pb-8">
        <ContactForm />
      </div>
    </div>
  );
}