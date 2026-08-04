import React from 'react';
import { cn } from '../../lib/cn';
import { PlusIcon } from 'lucide-react';

const ContactCard = ({
  title = 'Contact With Us',
  description = 'If you have any questions regarding our Services or need help, please fill out the form here. We do our best to respond within 1 business day.',
  contactInfo,
  className,
  formSectionClassName,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative grid h-full w-full border bg-[var(--c-surface)] shadow md:grid-cols-2 lg:grid-cols-3',
        className
      )}
      {...props}
    >
      <PlusIcon className="absolute -left-3 -top-3 h-6 w-6 text-[var(--c-accent)]" />
      <PlusIcon className="absolute -right-3 -top-3 h-6 w-6 text-[var(--c-accent)]" />
      <PlusIcon className="absolute -bottom-3 -left-3 h-6 w-6 text-[var(--c-accent)]" />
      <PlusIcon className="absolute -bottom-3 -right-3 h-6 w-6 text-[var(--c-accent)]" />
      <div className="flex flex-col justify-between lg:col-span-2">
        <div className="relative h-full space-y-4 px-4 py-8 md:p-8">
          <h1 className="font-[Space_Grotesk] text-3xl font-bold tracking-tight text-[var(--c-text)] md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="max-w-xl text-sm text-[var(--c-text-dim)] md:text-base lg:text-lg">
            {description}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contactInfo?.map((info, index) => (
              <ContactInfo key={index} {...info} />
            ))}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'flex h-full w-full items-center border-[var(--c-border)] bg-[rgba(255,255,255,0.02)] p-5 md:col-span-1 md:border-l md:border-t-0 border-t',
          formSectionClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

const ContactInfo = ({ icon: Icon, label, value, href, className, ...props }) => {
  const content = (
    <>
      <div className="rounded-lg border border-[var(--c-border)] bg-[rgba(255,255,255,0.04)] p-3.5 text-[var(--c-accent)] transition-colors group-hover:bg-[var(--c-accent)] group-hover:text-[var(--c-bg)]">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="text-xl font-medium text-[var(--c-text)]">{label}</p>
        <p className="text-base text-[var(--c-text-dim)] transition-colors group-hover:text-[var(--c-accent)]">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('group flex items-center gap-3 py-3 no-underline', className)}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cn('flex items-center gap-3 py-3', className)} {...props}>
      {content}
    </div>
  );
};

export default ContactCard;
