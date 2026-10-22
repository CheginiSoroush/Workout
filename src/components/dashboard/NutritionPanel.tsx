"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NUTRITION_NOTES } from "@/lib/program";
import {
  UtensilsCrossed,
  Beef,
  Pill,
  Moon,
  GlassWater,
  Bike,
} from "lucide-react";

const ICONS = [
  <UtensilsCrossed key="0" className="w-5 h-5 text-primary" />,
  <Beef key="1" className="w-5 h-5 text-primary" />,
  <Pill key="2" className="w-5 h-5 text-primary" />,
  <Moon key="3" className="w-5 h-5 text-primary" />,
  <GlassWater key="4" className="w-5 h-5 text-primary" />,
  <Bike key="5" className="w-5 h-5 text-primary" />,
];

export default function NutritionPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-primary" />
          تغذیه و ریکاوری — نصف راه اینجاست
        </CardTitle>
      </CardHeader>
      <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {NUTRITION_NOTES.map((n, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-secondary/40 p-4 space-y-1.5"
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {ICONS[i % ICONS.length]}
              {n.title}
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{n.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
