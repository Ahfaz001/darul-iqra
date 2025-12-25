import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, GraduationCap, Send } from "lucide-react";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

const admissionSchema = z.object({
  full_name: z.string().min(2, "Full name is required").max(100),
  father_name: z.string().min(2, "Father's name is required").max(100),
  husband_name: z.string().max(100).optional(),
  age: z.coerce.number().min(10, "Age must be at least 10").max(100, "Age must be less than 100"),
  mobile_number: z.string().min(10, "Mobile number is required").max(15),
  whatsapp_number: z.string().max(15).optional(),
  education_medium: z.string().min(1, "Please select education medium"),
  declaration_agreed: z.boolean().refine(val => val === true, "You must agree to the declaration"),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

const AdmissionForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      full_name: "",
      father_name: "",
      husband_name: "",
      age: undefined,
      mobile_number: "",
      whatsapp_number: "",
      education_medium: "",
      declaration_agreed: false,
    },
  });

  const onSubmit = async (data: AdmissionFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("admissions").insert({
        full_name: data.full_name,
        father_name: data.father_name,
        husband_name: data.husband_name || null,
        age: data.age,
        mobile_number: data.mobile_number,
        whatsapp_number: data.whatsapp_number || null,
        education_medium: data.education_medium,
        declaration_agreed: data.declaration_agreed,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-amber-50 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-10 w-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Application Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              JazakAllahu Khairan! Your admission application has been received. We will contact you soon.
            </p>
            <p className="text-lg font-arabic text-emerald-600 mb-6">
              جزاك الله خيرا
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-amber-50 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/20 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Header Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 text-center">
            <p className="text-xl font-arabic mb-4">
              خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ
            </p>
            <p className="text-sm opacity-90 italic">
              "The best among you are those who learn the Qur'an and teach it."
            </p>
            <p className="text-xs opacity-75 mt-1">(Sahih al-Bukhari)</p>
          </div>
          <CardContent className="p-6 text-center">
            <img 
              src={madrasaLogo} 
              alt="Idarah Logo" 
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-emerald-200"
            />
            <h1 className="text-2xl font-bold text-foreground mb-2">ONLINE ADMISSION FORM</h1>
            <h2 className="text-lg font-semibold text-emerald-600 mb-1">
              Idarah Tarjamat-ul-Qur'an wa Sunnah
            </h2>
            <p className="text-muted-foreground">presents</p>
            <h3 className="text-xl font-bold text-primary mt-2">"Uloome Shari'ah Course"</h3>
            <p className="text-amber-600 font-medium mt-2">For Females Only</p>
            
            <div className="grid grid-cols-3 gap-4 mt-6 text-sm">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-semibold text-foreground">Mode</p>
                <p className="text-muted-foreground">Offline Only</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-semibold text-foreground">Fee</p>
                <p className="text-emerald-600 font-medium">Free</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-semibold text-foreground">Duration</p>
                <p className="text-muted-foreground">5 Years</p>
              </div>
            </div>
            
            <p className="mt-4 text-muted-foreground">
              Instructor: <span className="font-medium text-foreground">Alimah Aayesha Muneer Khan</span>
            </p>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-emerald-600" />
              Application Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    1. Basic Information
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="father_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter father's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="husband_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Husband's Name (if applicable)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter husband's name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter your age" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 2: Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    2. Contact Details
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="mobile_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter mobile number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="whatsapp_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter WhatsApp number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Section 3: Educational Background */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                    3. Educational Background
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="education_medium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medium of Education *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select medium of education" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="urdu">Urdu</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="hindi">Hindi</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Declaration */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <FormField
                    control={form.control}
                    name="declaration_agreed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I hereby declare that the information provided above is true and correct. 
                            I agree to follow the rules, discipline, and Islamic adab of 
                            Idarah Tarjamat-ul-Qur'an wa Sunnah. *
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdmissionForm;
