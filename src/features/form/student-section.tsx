import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { CreateInternshipFormData } from "@/features/form/internship.schema";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMajorsForYear, getOptionsForMajor, hasOptionsForMajor } from "@/features/form/options";

interface StudentSectionProps {
  register: UseFormRegister<CreateInternshipFormData>;
  errors: FieldErrors<CreateInternshipFormData>;
  setValue: UseFormSetValue<CreateInternshipFormData>;
  watch: UseFormWatch<CreateInternshipFormData>;
}

export function StudentSection({ register, errors, setValue, watch }: StudentSectionProps) {
  const [showMajorHint, setShowMajorHint] = useState(false);
  const [showOptionHint, setShowOptionHint] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const watchedAcademicYear = watch("academicYear");
  const watchedStudentMajor = watch("studentMajor");
  const watchedStudentOption = watch("studentOption");

  const availableMajors = watchedAcademicYear ? getMajorsForYear(watchedAcademicYear) : [];
  const availableOptions =
    watchedAcademicYear && watchedStudentMajor
      ? getOptionsForMajor(watchedAcademicYear, watchedStudentMajor)
      : [];
  const hasOptions =
    watchedAcademicYear && watchedStudentMajor
      ? hasOptionsForMajor(watchedAcademicYear, watchedStudentMajor)
      : false;

  const selectedMajor =
    (watchedStudentMajor && availableMajors.find((major) => major.value === watchedStudentMajor)) ||
    undefined;
  const selectedOption =
    (watchedStudentOption &&
      availableOptions.find((option) => option.value === watchedStudentOption)) ||
    undefined;

  useEffect(() => {
    if (watchedAcademicYear) {
      setValue("studentMajor", "");
      setValue("studentOption", "");
      setResetKey((prev) => prev + 1);
    }
  }, [watchedAcademicYear, setValue]);

  useEffect(() => {
    if (watchedStudentMajor) {
      setValue("studentOption", "");
    }
  }, [watchedStudentMajor, setValue]);

  useEffect(() => {
    if (showMajorHint) {
      const timer = setTimeout(() => setShowMajorHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMajorHint]);

  useEffect(() => {
    if (showOptionHint) {
      const timer = setTimeout(() => setShowOptionHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showOptionHint]);

  const handleStudentMajorChange = (option: Option | undefined) => {
    setValue("studentMajor", option?.value ?? "");
  };

  const handleStudentOptionChange = (option: Option | undefined) => {
    setValue("studentOption", option?.value ?? "");
  };

  const handleMajorDisabledClick = () => {
    if (!watchedAcademicYear) {
      setShowMajorHint(true);
      setShowOptionHint(false);
    }
  };

  const handleOptionDisabledClick = () => {
    if (!watchedAcademicYear) {
      setShowOptionHint(true);
      setShowMajorHint(false);
    } else if (!watchedStudentMajor) {
      setShowOptionHint(true);
      setShowMajorHint(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Étudiant</h3>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentFirstName">
            Prénom <span className="text-destructive">*</span>
          </Label>
          <Input
            id="studentFirstName"
            {...register("studentFirstName")}
            className={
              errors.studentFirstName ? "border-destructive focus-visible:ring-destructive" : ""
            }
            placeholder="Jean"
          />
          {errors.studentFirstName && (
            <p className="text-destructive text-sm">{errors.studentFirstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentLastName">
            Nom <span className="text-destructive">*</span>
          </Label>
          <Input
            id="studentLastName"
            {...register("studentLastName")}
            className={
              errors.studentLastName ? "border-destructive focus-visible:ring-destructive" : ""
            }
            placeholder="Dupont"
          />
          {errors.studentLastName && (
            <p className="text-destructive text-sm">{errors.studentLastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentMajor">
            Filière <span className="text-destructive">*</span>
          </Label>
          <AutoComplete
            key={`major-${watchedAcademicYear || "no-year"}-${resetKey}`}
            options={availableMajors}
            value={selectedMajor}
            onValueChange={handleStudentMajorChange}
            onDisabledClick={handleMajorDisabledClick}
            placeholder={
              watchedAcademicYear ? "Sélectionnez une filière" : "Sélectionnez d'abord une année"
            }
            emptyMessage="Aucun résultat"
            error={!!errors.studentMajor}
            disabled={!watchedAcademicYear}
          />
          {showMajorHint && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Veuillez d'abord sélectionner une année</AlertTitle>
            </Alert>
          )}
          {errors.studentMajor && (
            <p className="text-destructive text-sm">{errors.studentMajor.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="studentOption">
            Option <span className="text-destructive">*</span>
          </Label>
          <AutoComplete
            key={`option-${watchedAcademicYear || "no-year"}-${watchedStudentMajor || "no-major"}-${resetKey}`}
            options={availableOptions}
            value={selectedOption}
            onValueChange={handleStudentOptionChange}
            onDisabledClick={handleOptionDisabledClick}
            placeholder={
              !watchedAcademicYear
                ? "Sélectionnez une année"
                : !watchedStudentMajor
                  ? "Sélectionnez une filière"
                  : !hasOptions
                    ? "Aucune option"
                    : "Sélectionnez une option"
            }
            emptyMessage="Aucun résultat"
            error={!!errors.studentOption}
            disabled={!watchedAcademicYear || !watchedStudentMajor || !hasOptions}
          />
          {showOptionHint && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>
                Veuillez d'abord sélectionner{" "}
                {!watchedAcademicYear ? "une année" : "une filière"}
              </AlertTitle>
            </Alert>
          )}
          {errors.studentOption && (
            <p className="text-destructive text-sm">{errors.studentOption.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
