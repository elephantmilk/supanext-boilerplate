"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    children: null,
    childrencount: "",
    childrenages: [],
    married: null,
    partnername: "",
    childrenRelations: [] as string[],
    phone: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    const { data, error } = await supabase
      .from('onboarding_data')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (data) {
      setFormData({
        name: data.name || "",
        age: data.age || "",
        email: data.email || "",
        children: data.has_children,
        childrencount: data.children_count || "",
        childrenages: data.children_ages || [],
        married: data.is_married,
        partnername: data.partner_name || "",
        childrenRelations: data.children_relations || [],
        phone: data.phone || "",
      });
    }
  };

  const saveFormData = async () => {
    const { error } = await supabase
      .from('onboarding_data')
      .upsert({
        name: formData.name,
        age: formData.age,
        email: formData.email,
        has_children: formData.children,
        children_count: formData.childrencount,
        children_ages: formData.childrenages,
        is_married: formData.married,
        partner_name: formData.partnername,
        children_relations: formData.childrenRelations,
        phone: formData.phone,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Fehler beim Speichern:', error.message);
      return;
    }

    console.log('Daten erfolgreich gespeichert');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Bitte geben Sie Ihre E-Mail-Adresse ein";
    if (!emailRegex.test(email)) return "Bitte geben Sie eine gültige E-Mail-Adresse ein";
    return "";
  };

  const validateAge = (age: number): boolean => {
    return age >= 18 && age <= 100;
  };

  const handleNext = async () => {
    let validationError = "";

    switch (step) {
      case 2:
        validationError = validateAge(parseInt(formData.age)) ? "" : "Bitte geben Sie ein gültiges Alter ein";
        break;
      case 3:
        validationError = validateEmail(formData.email);
        break;
      case 7:
        if (formData.children && formData.married && 
            formData.childrenRelations.length < parseInt(formData.childrencount)) {
          validationError = "Bitte geben Sie für jedes Kind die Beziehung an";
        }
        break;
      case 8:
        if (!formData.phone) {
          validationError = "Bitte geben Sie Ihre Telefonnummer ein";
        }
        break;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    await saveFormData();
    setError("");
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError("");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div>
              <h1 className="text-2xl font-semibold">
                Hallo,<br />
                mein Name ist Hubert Heritax.
              </h1>
              <p className="text-muted-foreground mt-2">
                Ich werde Ihnen ein paar Fragen stellen,<br />
                um Sie besser kennenzulernen.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Wie heißen Sie?"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div>
              <h1 className="text-2xl font-semibold">
                Wie alt sind Sie{formData.name ? `, ${formData.name}` : ""}?
              </h1>
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Bitte geben Sie Ihr Alter ein"
                value={formData.age}
                onChange={(e) => {
                  setFormData({ ...formData, age: e.target.value });
                  setError("");
                }}
                required
                min="12"
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div>
              <h1 className="text-2xl font-semibold">
                Wie können wir per E-Mail in Kontakt bleiben?
              </h1>
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Bitte teilen Sie mir Ihre E-Mail Adresse mit"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setError("");
                }}
                required
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </>
        );

      case 4:
        return (
          <>
            <div>
              <h1 className="text-2xl font-semibold">Haben Sie Kinder?</h1>
            </div>
            <RadioGroup
              value={formData.children?.toString()}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  children: value === "true",
                  childrencount: "",
                  childrenages: [],
                  childrenRelations: [],
                });
              }}
            >
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="children-yes" />
                  <Label htmlFor="children-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="children-no" />
                  <Label htmlFor="children-no">Nein</Label>
                </div>
              </div>
            </RadioGroup>

            {formData.children && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Wie viele Kinder?</h2>
                <div className="flex space-x-2 mt-4">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Button
                      key={num}
                      variant={formData.childrencount === num.toString() ? "default" : "outline"}
                      onClick={() => setFormData({ ...formData, childrencount: num.toString() })}
                    >
                      {num}
                    </Button>
                  ))}
                  <Select
                    value={formData.childrencount}
                    onValueChange={(value) => setFormData({ ...formData, childrencount: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mehr" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => i + 6).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </>
        );

      case 5:
        return formData.children ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold">Wie alt sind die Kinder?</h1>
            </div>
            <div className="space-y-4 mt-4">
              {Array.from({ length: parseInt(formData.childrencount) }, (_, i) => (
                <div key={i} className="space-y-2">
                  <Label>Kind {i + 1}</Label>
                  <Select
                    value={formData.childrenages[i]?.toString()}
                    onValueChange={(value) => {
                      const newAges = [...formData.childrenages];
                      newAges[i] = parseInt(value);
                      setFormData({ ...formData, childrenages: newAges });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Bitte wählen Sie das Alter aus" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 18 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {i} Jahre
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </>
        ) : null;

      case 6:
        return (
          <>
            <div>
              <h1 className="text-2xl font-semibold">
                Sind Sie verheiratet oder leben in einer eheähnlichen Gemeinschaft?
              </h1>
            </div>
            <RadioGroup
              value={formData.married?.toString()}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  married: value === "true",
                  partnername: ""
                });
              }}
            >
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="married-yes" />
                  <Label htmlFor="married-yes">Ja</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="married-no" />
                  <Label htmlFor="married-no">Nein</Label>
                </div>
              </div>
            </RadioGroup>

            {formData.married && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold">Mit wem?</h2>
                <Input
                  className="mt-4"
                  placeholder="Bitte geben Sie hier den Namen ein"
                  value={formData.partnername}
                  onChange={(e) => setFormData({ ...formData, partnername: e.target.value })}
                />
              </div>
            )}
          </>
        );

      case 7:
        return formData.children && formData.married ? (
          <>
            <div>
              <h1 className="text-2xl font-semibold">
                In welcher Beziehung stehen die Kinder zu {formData.partnername}?
              </h1>
            </div>
            <div className="space-y-4 mt-4">
              {Array.from({ length: parseInt(formData.childrencount) }, (_, i) => (
                <div key={i} className="space-y-2">
                  <Label>Kind {i + 1} ({formData.childrenages[i]} Jahre)</Label>
                  <RadioGroup
                    value={formData.childrenRelations[i]}
                    onValueChange={(value) => {
                      const newRelations = [...formData.childrenRelations];
                      newRelations[i] = value;
                      setFormData({ ...formData, childrenRelations: newRelations });
                    }}
                  >
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="leiblich" id={`leiblich-${i}`} />
                        <Label htmlFor={`leiblich-${i}`}>leiblich</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="angeheiratet" id={`angeheiratet-${i}`} />
                        <Label htmlFor={`angeheiratet-${i}`}>angeheiratet</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="adoptiert" id={`adoptiert-${i}`} />
                        <Label htmlFor={`adoptiert-${i}`}>adoptiert</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              ))}
            </div>
          </>
        ) : null;

      case 8:
        return (
          <>
            <div>
              <h1 className="text-2xl font-semibold">
                Können wir Sie telefonisch erreichen?
              </h1>
              <p className="text-muted-foreground mt-2">
                Hier bitte Ihre Telefonnummer
              </p>
            </div>
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Telefonnummer"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderStep()}
      <div className="flex justify-between pt-6">
        <Button 
          variant="secondary"
          onClick={handleBack}
          disabled={step === 1}
        >
          {step === 1 ? "Abbrechen" : "Zurück"}
        </Button>
        <Button 
          onClick={handleNext}
          disabled={
            (step === 1 && !formData.name) || 
            (step === 2 && (!formData.age || parseInt(formData.age) < 12)) ||
            (step === 3 && !formData.email) ||
            (step === 4 && formData.children === null) ||
            (step === 4 && formData.children && !formData.childrencount) ||
            (step === 5 && formData.children && formData.childrenages.length < parseInt(formData.childrencount)) ||
            (step === 6 && formData.married === null) ||
            (step === 6 && formData.married && !formData.partnername) ||
            (step === 7 && formData.childrenRelations.length < parseInt(formData.childrencount)) ||
            (step === 8 && !formData.phone)
          }
        >
          {step === 8 ? "Fertig" : "Zum nächsten Schritt"}
        </Button>
      </div>
    </div>
  );
} 