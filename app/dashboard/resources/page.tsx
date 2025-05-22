"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const resources = [
  {
    name: "แบบฟอร์มประเมินการฝึกงาน",
    url: "https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/useruploaded_course_files/2023_3/43361/materials/แบบฟอร์มประเมินฝึกงาน-360766-17077898495897.pdf",
  },
  {
    name: "Internship Evaluation Form",
    url: "https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/useruploaded_course_files/2023_3/43361/materials/internship_eval_form-360766-17077898381157.pdf",
  },
  {
    name: "CP Internship Guide 2024-2025",
    url: "https://mycourseville-default.s3.ap-southeast-1.amazonaws.com/useruploaded_course_files/2024_3/61723/materials/Internship_Guide_2024_2025-360766-17364782779956.pdf",
  },
];

export default function ResourcesPage() {
  return (
    <div className="container px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          เอกสารประกอบการฝึกงาน
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card
            key={index}
            onClick={() => window.open(resource.url, "_blank")}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                {resource.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground truncate overflow-hidden text-ellipsis">
                {resource.url}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
