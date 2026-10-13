interface BreadcrumbsProps {
  root: string;
  current: string;
}

export default function Breadcrumbs({ root, current }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs">
      <span>{root}</span>
      <span className="breadcrumb-slash">/</span>
      <strong>{current}</strong>
    </div>
  );
}
