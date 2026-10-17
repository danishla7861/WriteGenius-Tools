import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#AAB8D0] py-2">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-[#4776FF] transition-colors focus:outline-none rounded"
          >
            <Home className="w-3.5 h-3.5 text-[#4776FF]" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} className="flex items-center space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-[#263653] shrink-0" aria-hidden="true" />
              {isLast || !item.path ? (
                <span className="font-semibold text-[#F8FAFF] truncate max-w-[200px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-[#4776FF] transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
