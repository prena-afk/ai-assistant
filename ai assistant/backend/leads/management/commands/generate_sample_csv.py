"""
Management command to generate a sample CSV file with dummy lead data
Usage: python manage.py generate_sample_csv --output sample_leads.csv --count 50
"""

from django.core.management.base import BaseCommand
import csv
import random
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Generate a sample CSV file with dummy lead data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--output',
            type=str,
            default='sample_leads.csv',
            help='Output CSV file name (default: sample_leads.csv)'
        )
        parser.add_argument(
            '--count',
            type=int,
            default=50,
            help='Number of leads to generate (default: 50)'
        )

    def handle(self, *args, **options):
        output_file = options['output']
        count = options['count']
        
        # Sample data pools
        first_names = [
            'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica',
            'William', 'Ashley', 'James', 'Amanda', 'Christopher', 'Melissa', 'Daniel',
            'Michelle', 'Matthew', 'Kimberly', 'Anthony', 'Amy', 'Mark', 'Angela',
            'Donald', 'Lisa', 'Steven', 'Nancy', 'Paul', 'Karen', 'Andrew', 'Betty'
        ]
        
        last_names = [
            'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
            'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas',
            'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
            'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
        ]
        
        domains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com',
            'company.com', 'business.com', 'email.com', 'mail.com', 'test.com'
        ]
        
        sources = [
            'Website', 'Referral', 'Social Media', 'Email Campaign', 'Trade Show',
            'Google Ads', 'Facebook Ads', 'LinkedIn', 'Cold Call', 'Partner'
        ]
        
        service_types = [
            'Consultation', 'Coaching', 'Therapy', 'Session', 'Workshop', 'Other'
        ]
        
        statuses = ['new', 'contacted', 'qualified', 'converted', 'lost']
        
        # Generate CSV
        with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = [
                'Name', 'Email', 'Phone', 'Source', 'Status', 'Service Type',
                'Notes', 'Price', 'Potential Value', 'Description of Enquiry'
            ]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            # Write header
            writer.writeheader()
            
            # Generate dummy leads
            for i in range(count):
                first_name = random.choice(first_names)
                last_name = random.choice(last_names)
                name = f"{first_name} {last_name}"
                email = f"{first_name.lower()}.{last_name.lower()}@{random.choice(domains)}"
                
                # Generate phone number
                phone = f"{random.randint(100, 999)}-{random.randint(100, 999)}-{random.randint(1000, 9999)}"
                
                source = random.choice(sources)
                status = random.choice(statuses)
                service_type = random.choice(service_types)
                
                # Generate notes
                notes_options = [
                    f"Interested in {service_type.lower()}",
                    "Follow up next week",
                    "Requested more information",
                    "Very interested, high priority",
                    "Warm lead from referral",
                    ""
                ]
                notes = random.choice(notes_options)
                
                # Generate price and potential value
                price = round(random.uniform(100, 5000), 2) if random.random() > 0.3 else None
                potential_value = round(random.uniform(500, 10000), 2) if random.random() > 0.2 else None
                
                # Generate description
                descriptions = [
                    f"Looking for {service_type.lower()} services",
                    "Interested in learning more about our offerings",
                    "Requested consultation",
                    "Wants to schedule a session",
                    "Inquiry about pricing and packages",
                    ""
                ]
                description = random.choice(descriptions)
                
                writer.writerow({
                    'Name': name,
                    'Email': email,
                    'Phone': phone,
                    'Source': source,
                    'Status': status,
                    'Service Type': service_type,
                    'Notes': notes,
                    'Price': price if price else '',
                    'Potential Value': potential_value if potential_value else '',
                    'Description of Enquiry': description
                })
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully generated {count} leads in {output_file}')
        )
        self.stdout.write(f'File location: {output_file}')
        self.stdout.write('\nYou can now upload this file in the Leads tab!')

