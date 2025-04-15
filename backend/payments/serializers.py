from rest_framework import serializers
from .models import WithDrawFunds

class WithDrawSerializer(serializers.ModelSerializer):
    class Meta:
        model = WithDrawFunds
        fields = ['id','amount', 'user','bank_card_to_with_draw']  # Include all necessary fields

    def validate_amount(self, value):
        # Add any custom validation for amount, if needed
        if value <= 0:
            raise serializers.ValidationError("امکان برداشت وجود ندارد")
        return value