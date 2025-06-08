from django.db import models
from django.contrib.auth import get_user_model
import json
from ConsultHub.models import DebugSession, ConsultSession

User = get_user_model()

class AIRequest(models.Model):
    REQUEST_TYPES = (
        ('debug', 'Debug Request'),
        ('consult', 'Consultation Request'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_requests')
    request_type = models.CharField(max_length=10, choices=REQUEST_TYPES)
    original_message = models.TextField()
    ai_response = models.TextField()
    difficulty = models.IntegerField()
    estimated_time_minutes = models.IntegerField()
    programming_language = models.CharField(max_length=50)
    framework = models.CharField(max_length=50)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def parse_ai_response(self):
        try:
            # Extract JSON from the response
            print("Full AI Response:")
            print(self.ai_response)
            
            # Find the JSON part between ```json and ```
            json_start = self.ai_response.find('```json')
            json_end = self.ai_response.find('```', json_start + 6)
            
            if json_start == -1 or json_end == -1:
                raise ValueError("Could not find JSON in the response")
                
            # Extract JSON and clean it
            json_str = self.ai_response[json_start + 6:json_end].strip()
            # Remove any extra characters at the start
            json_str = json_str.lstrip('n').strip()
            
            print("\nExtracted JSON:")
            print(json_str)
            
            data = json.loads(json_str)
            print("\nParsed Data:")
            print(data)
            
            if 'bugs' in data and len(data['bugs']) > 0:
                bug = data['bugs'][0]
                print("\nExtracted Bug Data:")
                print(f"Difficulty: {bug.get('difficulty')}")
                print(f"Time: {bug.get('estimated_time_minutes')}")
                print(f"Language: {bug.get('language')}")
                print(f"Framework: {bug.get('framework')}")
                
                # Set the values directly from the bug data
                self.difficulty = bug['difficulty']
                self.estimated_time_minutes = bug['estimated_time_minutes']
                self.programming_language = bug['language']
                self.framework = bug['framework']
                self.save()
                
                print("\nCalling create_session...")
                # Create a session after parsing
                session = self.create_session()
                print(f"Session created successfully: {session}")
            else:
                raise ValueError("No bugs found in the response")
                
        except Exception as e:
            print(f"Error parsing AI response: {str(e)}")
            # Set default values if parsing fails
            self.difficulty = 0
            self.estimated_time_minutes = 0
            self.save()
            raise e

    def find_suitable_experts(self):
        # Get experts based on request type and difficulty
        if self.request_type == 'debug':
            # For debug requests, find debuggers who can handle this difficulty level
            # Experts can only handle bugs with difficulty <= their score
            experts = User.objects.filter(
                user_roles__name='debugger',
                user_score__gte=self.difficulty - 5  # Expert score must be >= bug difficulty
            ).order_by('-user_score')
        else:
            # For consultation requests, find consultants with relevant expertise
            # Consultants can only handle requests with difficulty <= their score
            experts = User.objects.filter(
                user_roles__name='consultant',
                user_expertise__expertise__title__icontains=self.programming_language,
                user_score__gte=self.difficulty  # Expert score must be >= request difficulty
            ).order_by('-user_score')

        return experts

    def assign_to_best_expert(self):
        experts = self.find_suitable_experts()
        if experts.exists():
            # Assign to the expert with highest score
            self.assigned_to = experts.first()
            self.status = 'assigned'
            self.save()
            return True
        return False

    def create_session(self):
        """
        Creates a DebugSession or ConsultSession based on the request type and AI analysis
        """
        try:
            print("\nCreating session...")
            print(f"Request type: {self.request_type}")
            print(f"User: {self.user}")
            print(f"Language: {self.programming_language}")
            print(f"Time: {self.estimated_time_minutes}")
            
            if self.request_type == 'debug':
                # Find a suitable debugger
                debuggers = User.objects.filter(
                    user_roles__name='debugger',
                    user_score__gte=self.difficulty * 1.5
                ).order_by('-user_score')
                
                if not debuggers.exists():
                    raise ValueError("No suitable debugger found")
                    
                debugger = debuggers.first()
                print(f"Found debugger: {debugger.username}")
                
                session = DebugSession.objects.create(
                    title=f"Debug Session for {self.programming_language}",
                    debuger=debugger,  # Set the debugger
                    debuger_applicator=self.user,
                    description=self.original_message,
                    time=self.estimated_time_minutes,
                    price=self.calculate_price(),
                    discount=0,
                    status='pending',
                    mode='chat'
                )
                print(f"Debug session created with ID: {session.session_id}")
            else:
                # Find a suitable consultant
                consultants = User.objects.filter(
                    user_roles__name='consultant',
                    user_expertise__expertise__title__icontains=self.programming_language
                ).order_by('-user_score')
                
                if not consultants.exists():
                    raise ValueError("No suitable consultant found")
                    
                consultant = consultants.first()
                print(f"Found consultant: {consultant.username}")
                
                session = ConsultSession.objects.create(
                    title=f"Consultation Session for {self.programming_language}",
                    consult=consultant,  # Set the consultant
                    consult_applicator=self.user,
                    description=self.original_message,
                    price=self.calculate_price(),
                    discount=0,
                    language=self.programming_language,
                    status='pending',
                    mode='chat'
                )
                print(f"Consult session created with ID: {session.session_id}")
            return session
        except Exception as e:
            print(f"Error creating session: {str(e)}")
            raise e

    def calculate_price(self):
        """
        Calculate the price based on difficulty and estimated time
        Base price: 1000
        Difficulty multiplier: 1.5x per level
        Time multiplier: 1.2x per 10 minutes
        """
        base_price = 1000
        difficulty_multiplier = 1 + (self.difficulty * 0.5)
        time_multiplier = 1 + ((self.estimated_time_minutes / 10) * 0.2)
        return int(base_price * difficulty_multiplier * time_multiplier)

    class Meta:
        ordering = ['-created_at']
