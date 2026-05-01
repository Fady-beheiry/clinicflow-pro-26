import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { DoctorSection } from "@/components/site/DoctorSection";
import { Testimonials } from "@/components/site/Testimonials";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { WhatsAppButton } from "@/components/site/WhatsAppButton";
import { Chatbot } from "@/components/chatbot/Chatbot";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <DoctorSection />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
    </div>
  );
};

export default Index;
