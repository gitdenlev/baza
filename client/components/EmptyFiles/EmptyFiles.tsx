import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

import React from "react";
import Image from "next/image";

export function EmptyFiles({
  title,
  description,
  children,
  image,
  imageAlt,
}: {
  title?: string;
  description: string;
  children?: React.ReactNode;
  image: string;
  imageAlt: string;
}) {
  return (
    <Empty className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      <EmptyHeader>
        <Image src={image} alt={imageAlt} width={150} height={150} />
        <EmptyTitle className="text-2xl">{title}</EmptyTitle>
        <EmptyDescription className="text-lg">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        {children}
      </EmptyContent>
    </Empty>
  );
}