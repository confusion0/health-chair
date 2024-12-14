from datetime import datetime
from copy import deepcopy

class HeartRateTracker:
    def __init__(self, rates=None):
        # store rates as [date/time, rate]
        if not rates:
            self.heart_rates = []
        else:
            self.heart_rates = rates
    
    def get_resting_heart_rate() -> int:
        cop = deepcopy(self.heart_rates)
        cop.sort(key=lambda x:x[1])  # sort by heart rate
        return cop[len(cop)//2]



if __name__ == "__main__":
    from random import randint
    test_user = HeartRateTracker([])
    print(test_user.get_resting_heart_rate())

