"use client";
import * as React from "react";
import { useState } from "react";
import { SortInternshipButton } from "@/features/internship/internship-sort";
import { InternshipFD } from "@/data/fake-data";

type InternshipHeaderProps = {
    sort: string;
    setSort: (v: string) => void;
    fakeInternships: InternshipFD[];
};

export function InternshipHeader({ fakeInternships, sort, setSort }: InternshipHeaderProps) {

    return (
        <div className="flex justify-between items-center w-full">
            <p className="text-gray-600">
                {fakeInternships.length} stage{fakeInternships.length > 1 ? "s" : ""} trouvé{fakeInternships.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
                <p className="text-gray-600">Trier par:</p>
                <SortInternshipButton
                    value={sort}
                    onChange={setSort}
                />
            </div>
        </div>
    );
}