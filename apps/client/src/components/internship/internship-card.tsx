import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@chronos/ui/components/accordion";
import { Badge } from "@chronos/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chronos/ui/components/card";
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@chronos/ui/components/item";
import {
  BookOpen,
  Calendar,
  Clock,
  Flag,
  GraduationCap,
  MapPin,
  University,
} from "lucide-react";
import type { getInternshipsAction } from "@/actions/internship.action";

const ORGANIZATION_TYPE_LABELS = {
  company: "Entreprise",
  not_company: "Hors entreprise",
};

type InternshipCardProps = {
  internship: Awaited<ReturnType<typeof getInternshipsAction>>["data"][number];
};

export function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-2xl">{internship.subject}</CardTitle>
          {internship.organizationType && (
            <Badge variant="outline">
              {ORGANIZATION_TYPE_LABELS[internship.organizationType]}
            </Badge>
          )}
        </div>
        <CardDescription>{internship.organizationName}</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion multiple defaultValue={["studies"]}>
          <AccordionItem value="studies">
            <AccordionTrigger>Études</AccordionTrigger>
            <AccordionContent className="flex gap-2">
              <Item>
                <ItemMedia variant="icon">
                  <GraduationCap />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{internship.academicYear}</ItemTitle>
                </ItemContent>
              </Item>
              <Item>
                <ItemMedia variant="icon">
                  <University />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{internship.major}</ItemTitle>
                </ItemContent>
              </Item>
              <Item>
                <ItemMedia variant="icon">
                  <BookOpen />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{internship.option}</ItemTitle>
                </ItemContent>
              </Item>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="locatisation">
            <AccordionTrigger>Localisation</AccordionTrigger>
            <AccordionContent className="flex gap-2">
              <Item>
                <ItemMedia variant="icon">
                  <Flag />
                </ItemMedia>
                <ItemContent> {internship.country}</ItemContent>
              </Item>
              <Item>
                <ItemMedia variant="icon">
                  <MapPin />
                </ItemMedia>
                <ItemContent> {internship.city}</ItemContent>
              </Item>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dates">
            <AccordionTrigger>Dates</AccordionTrigger>
            <AccordionContent className="flex gap-2">
              <Item>
                <ItemMedia variant="icon">
                  <Calendar />
                </ItemMedia>
                <ItemContent>
                  {internship.beginDate &&
                    new Date(internship.beginDate).toLocaleDateString("fr")}
                </ItemContent>
              </Item>
              <Item>
                <ItemMedia variant="icon">
                  <Clock />
                </ItemMedia>
                <ItemContent> {internship.weeksCount} semaines</ItemContent>
              </Item>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
