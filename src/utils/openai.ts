export async function generateMicroTask(procrastinationText: string): Promise<string> {
  try {
    const response = await fetch('/api/generate-micro-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ procrastinationText }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.task) {
      return data.task;
    } else {
      throw new Error("No task in response");
    }
  } catch (error) {
    console.error('API Error:', error);
    
    // Fallback to original logic if API fails
    const lowerText = procrastinationText.toLowerCase();
    
    if (lowerText.includes('gym') || lowerText.includes('workout') || lowerText.includes('exercise')) {
      return 'Put on your workout clothes and pack your gym bag';
    } else if (lowerText.includes('study') || lowerText.includes('homework') || lowerText.includes('learn')) {
      return 'Clear your desk and open your study materials';
    } else if (lowerText.includes('work') || lowerText.includes('project') || lowerText.includes('task')) {
      return 'Close distracting tabs and write one sentence about your project';
    } else if (lowerText.includes('clean') || lowerText.includes('tidy') || lowerText.includes('organize')) {
      return 'Pick up just 5 items and put them in their proper place';
    } else if (lowerText.includes('read') || lowerText.includes('book')) {
      return 'Find your book and read just the first paragraph';
    } else if (lowerText.includes('cook') || lowerText.includes('meal') || lowerText.includes('food')) {
      return 'Get out one cooking ingredient and place it on the counter';
    } else if (lowerText.includes('phone') || lowerText.includes('social') || lowerText.includes('scroll')) {
      return 'Put your phone in another room and take 3 deep breaths';
    } else if (lowerText.includes('call') || lowerText.includes('email') || lowerText.includes('message')) {
      return 'Open your contacts and find the person you need to reach';
    } else {
      return 'Stand up, take 3 deep breaths, and prepare your workspace';
    }
  }
}