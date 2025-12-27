import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  HeadphonesIcon,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Send,
  HelpCircle,
  BookOpen,
  FileQuestion,
  Clock,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Support: React.FC = () => {
  const { isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Your message has been sent successfully!');
    setFormData({ subject: '', message: '' });
    setIsSubmitting(false);
  };

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to the login page and click on "Forgot Password". Enter your email address and we will send you a password reset link.',
    },
    {
      question: 'How can I view my exam results?',
      answer: 'Navigate to "My Results" from the dashboard or sidebar. All your published results will be displayed there with detailed scores and feedback.',
    },
    {
      question: 'What should I do if I miss an exam?',
      answer: 'Contact your teacher or administrator immediately. They can reassign the exam or provide alternative arrangements based on your situation.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to "My Profile" section. You can update your name, language preference, and other details from there.',
    },
    {
      question: 'Who can I contact for technical issues?',
      answer: 'Use the contact form below or reach out to us via WhatsApp or phone during office hours.',
    },
  ];

  const quickLinks = [
    { title: 'View Exams', icon: FileQuestion, href: '/exams' },
    { title: 'Check Attendance', icon: Clock, href: '/attendance' },
    { title: 'Read Books', icon: BookOpen, href: '/books' },
    { title: 'FAQs', icon: HelpCircle, href: '#faqs' },
  ];

  return (
    <StudentLayout>
      <Helmet>
        <title>Help & Support | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta name="description" content="Get help and support for your student portal account." />
      </Helmet>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3 ${isRTL ? 'font-urdu' : ''}`}>
            <HeadphonesIcon className="h-8 w-8 text-primary" />
            Help & Support
          </h1>
          <p className="text-muted-foreground text-lg">
            We're here to help you with any questions or issues.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Info & Quick Links */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+91 XXXXX XXXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@idarah.edu</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">Kalyan, Maharashtra, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Office Hours</p>
                    <p className="text-sm text-muted-foreground">Mon - Sat: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {quickLinks.map((link) => (
                  <Button
                    key={link.title}
                    variant="outline"
                    className="justify-start gap-2 h-auto py-3"
                    asChild
                  >
                    <a href={link.href}>
                      <link.icon className="h-4 w-4" />
                      <span className="text-sm">{link.title}</span>
                    </a>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - FAQs & Contact Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* FAQs */}
            <Card id="faqs" className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Have a question? Fill out the form below and we'll get back to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What is your question about?"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue or question in detail..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Support;
