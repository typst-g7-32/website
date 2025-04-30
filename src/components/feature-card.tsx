import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
}

export function FeatureCard({ title, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="bg-gray-800/20 border border-gray-900 rounded-lg p-6 dark:border-neutral-800">
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}