import { Phone, ExternalLink } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const emergencyContacts = [
  {
    id: 'talk-suicide',
    name: 'Talk Suicide Canada',
    number: '1-833-456-4566',
    description: '24/7 national suicide prevention service',
    textInfo: 'Text 45645 (4PM - Midnight ET)',
  },
  {
    id: 'kids-help',
    name: 'Kids Help Phone',
    number: '1-800-668-6868',
    description: '24/7 support for youth and young adults',
    textInfo: 'Text CONNECT to 686868',
  },
  {
    id: 'crisis-services',
    name: 'Crisis Services Canada',
    number: '1-833-456-4566',
    description: '24/7 support in English and French',
  },
  {
    id: 'hope-wellness',
    name: 'Hope for Wellness Helpline',
    number: '1-855-242-3310',
    description: '24/7 mental health support for Indigenous peoples',
    textInfo: 'Online chat available at hopeforwellness.ca',
  },
  {
    id: 'trans-lifeline',
    name: 'Trans Lifeline',
    number: '1-877-330-6366',
    description: 'Peer support for transgender people',
  }
];

export function EmergencyResources() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Canadian Crisis Resources
          </CardTitle>
          <CardDescription>
            Free, confidential support available 24/7 across Canada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex flex-col gap-3 p-4 rounded-lg bg-muted"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {contact.description}
                  </p>
                  {contact.textInfo && (
                    <p className="text-sm text-primary mt-1">
                      {contact.textInfo}
                    </p>
                  )}
                </div>
                <Button
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => window.open(`tel:${contact.number}`)}
                >
                  {contact.number}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <p className="text-sm text-muted-foreground mt-4">
            If you're in immediate danger, please call 911 or visit your nearest emergency department.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}