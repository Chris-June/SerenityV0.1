import { Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const socialLinks = [
    {
      icon: Twitter,
      href: 'https://x.com/Intelli_Sync',
      label: 'Twitter',
    },
    
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/intellisync-solutions',
      label: 'LinkedIn',
    },
    {
      icon: Mail,
      href: 'mailto:chris.june@intellisync.ca',
      label: 'Email',
    },
  ];

  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0a0a]/60">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="hover:bg-[#2a2a2a] hover:text-primary transition-colors"
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{link.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <span className="animate-text bg-gradient-to-r from-primary via-emerald-500 via-teal-400 to-primary bg-clip-text text-transparent bg-300%">
              Powered by{' '}
              <a
                href="https://intellisyncsolutions.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
              >
                Intellisync Solutions
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}