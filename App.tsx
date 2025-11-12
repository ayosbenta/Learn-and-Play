// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Button from './components/Button';
import Card from './components/Card';
import ProgressBar from './components/ProgressBar';
import AudioPlayer from './components/AudioPlayer';
import QuizGame from './components/QuizGame';
import FunFactDisplay from './components/FunFactDisplay';
import RewardItem from './components/RewardItem';
import ToggleSwitch from './components/ToggleSwitch'; // Updated import path for ToggleSwitch
import ABCGame from './components/ABCGame';
import NumberGame from './components/NumberGame';
import ColorGame from './components/ColorGame';
import SnakeGame from './components/SnakeGame';
import InteractiveLesson from './components/InteractiveLesson'; // New import
import Storyteller from './components/Storyteller'; // New import
import DrawingPad from './components/DrawingPad'; // New import

import { AppSection, UserProgress, CharacterOutfit, ToddlerGameType, GameCompletionCallback, LearningActivityType, LearningCompletionCallback } from './types';
import { MASCOT_NAME, GAME_CATEGORIES, LESSON_TOPICS, INITIAL_CHARACTER_OUTFITS } from './constants';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.HOME);
  const [userName, setUserName] = useState<string>('Young Learner');
  const [userProgress, setUserProgress] = useState<UserProgress>({
    name: 'Young Learner',
    xp: 0,
    badges: [],
    recentActivities: [],
  });
  const [availableOutfits, setAvailableOutfits] = useState<CharacterOutfit[]>(INITIAL_CHARACTER_OUTFITS);
  const [currentOutfit, setCurrentOutfit] = useState<CharacterOutfit>(INITIAL_CHARACTER_OUTFITS[0]);
  // New state to manage which game is active. 'quiz' for QuizGame, ToddlerGameType for others.
  const [activeGame, setActiveGame] = useState<ToddlerGameType | 'quiz' | null>(null);
  // New state to manage active learning activity
  const [activeLearningActivity, setActiveLearningActivity] = useState<LearningActivityType | null>(null);
  const [activeLessonTopic, setActiveLessonTopic] = useState<{ id: string; title: string } | null>(null);

  // Parental Control States
  const [isSafeMode, setIsSafeMode] = useState<boolean>(true);
  const [screenTimeLimitMinutes, setScreenTimeLimitMinutes] = useState<number>(60);
  const [isLeaderboardDisabled, setIsLeaderboardDisabled] = useState<boolean>(false);
  // Custom Learning Plan States
  const [learningPlanFocusSubject, setLearningPlanFocusSubject] = useState<string>('Math');
  const [learningPlanDifficulty, setLearningPlanDifficulty] = useState<string>('Easy');


  // Simulate loading user data and parental controls
  useEffect(() => {
    const savedName = localStorage.getItem('learnPlayWorldUserName');
    if (savedName) {
      setUserName(savedName);
      setUserProgress(prev => ({ ...prev, name: savedName }));
    }
    const savedProgress = localStorage.getItem('learnPlayWorldProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    const savedOutfitId = localStorage.getItem('learnPlayWorldCurrentOutfit');
    if (savedOutfitId) {
      const outfit = INITIAL_CHARACTER_OUTFITS.find(o => o.id === savedOutfitId);
      if (outfit) setCurrentOutfit(outfit);
    }

    // Load parental controls
    const savedSafeMode = localStorage.getItem('learnPlayWorldSafeMode');
    if (savedSafeMode !== null) setIsSafeMode(JSON.parse(savedSafeMode));
    const savedScreenTime = localStorage.getItem('learnPlayWorldScreenTimeLimit');
    if (savedScreenTime !== null) setScreenTimeLimitMinutes(JSON.parse(savedScreenTime));
    const savedLeaderboardDisabled = localStorage.getItem('learnPlayWorldLeaderboardDisabled');
    if (savedLeaderboardDisabled !== null) setIsLeaderboardDisabled(JSON.parse(savedLeaderboardDisabled));

    // Load learning plan
    const savedFocusSubject = localStorage.getItem('learnPlayWorldFocusSubject');
    if (savedFocusSubject) setLearningPlanFocusSubject(savedFocusSubject);
    const savedDifficulty = localStorage.getItem('learnPlayWorldDifficulty');
    if (savedDifficulty) setLearningPlanDifficulty(savedDifficulty);

  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    localStorage.setItem('learnPlayWorldProgress', JSON.stringify(userProgress));
    localStorage.setItem('learnPlayWorldCurrentOutfit', currentOutfit.id);
  }, [userProgress, currentOutfit]);

  // Save parental controls whenever they change
  useEffect(() => {
    localStorage.setItem('learnPlayWorldSafeMode', JSON.stringify(isSafeMode));
  }, [isSafeMode]);

  useEffect(() => {
    localStorage.setItem('learnPlayWorldScreenTimeLimit', JSON.stringify(screenTimeLimitMinutes));
  }, [screenTimeLimitMinutes]);

  useEffect(() => {
    localStorage.setItem('learnPlayWorldLeaderboardDisabled', JSON.stringify(isLeaderboardDisabled));
  }, [isLeaderboardDisabled]);

  // Save learning plan when explicitly saved
  const handleSaveLearningPlan = useCallback(() => {
    localStorage.setItem('learnPlayWorldFocusSubject', learningPlanFocusSubject);
    localStorage.setItem('learnPlayWorldDifficulty', learningPlanDifficulty);
    alert('Learning plan saved!');
  }, [learningPlanFocusSubject, learningPlanDifficulty]);


  const addXP = (amount: number, activity: string) => {
    setUserProgress(prev => ({
      ...prev,
      xp: prev.xp + amount,
      recentActivities: [`Earned ${amount} XP from ${activity}`, ...prev.recentActivities].slice(0, 5),
    }));
  };

  const addBadge = (badgeName: string) => {
    setUserProgress(prev => ({
      ...prev,
      badges: Array.from(new Set([...prev.badges, badgeName])), // Ensure unique badges
      recentActivities: [`Earned new badge: ${badgeName}`, ...prev.recentActivities].slice(0, 5),
    }));
  };

  const handleGameComplete: GameCompletionCallback = (score, total, gameType) => {
    let xpEarned = 0;
    let badgeName = '';
    let activityName = '';

    switch (gameType) {
      case ToddlerGameType.ABC:
        xpEarned = score * 5;
        badgeName = 'Alphabet Explorer';
        activityName = 'ABC Fun Game';
        break;
      case ToddlerGameType.NUMBERS:
        xpEarned = score * 5;
        badgeName = 'Number Ninja';
        activityName = '123 Adventure Game';
        break;
      case ToddlerGameType.COLORS:
        xpEarned = score * 5;
        badgeName = 'Color Champion';
        activityName = 'Color Match Game';
        break;
      case ToddlerGameType.SNAKE: // Handle Snake game completion
        xpEarned = score * 2; // 2 XP per snake segment
        badgeName = 'Snake Master';
        activityName = 'Snake Game';
        break;
      case 'quiz': // Handle Quiz game completion
        xpEarned = score * 10; // 10 XP per correct answer
        badgeName = `Quiz Master (${total} questions)`;
        activityName = 'Quiz Game';
        break;
      default:
        break;
    }

    addXP(xpEarned, activityName);
    if (score === total && badgeName) {
      addBadge(badgeName);
    }
    console.log(`${activityName} completed! You scored ${score}/${total}. Earned ${xpEarned} XP!`);
    setActiveGame(null); // Go back to game selection after any game completes
  };

  const handleLearningComplete: LearningCompletionCallback = (xpEarned, activityType, details) => {
    let activityName = '';
    let badgeName = '';

    switch (activityType) {
      case LearningActivityType.INTERACTIVE_LESSON:
        activityName = `Interactive Lesson: ${details}`;
        if (xpEarned > 0) badgeName = 'Lesson Learner';
        break;
      case LearningActivityType.INTERACTIVE_STORY:
        activityName = `Interactive Story: ${details}`;
        if (xpEarned > 0) badgeName = 'Story Explorer';
        break;
      case LearningActivityType.DRAWING_PAD:
        activityName = `Drawing Activity: ${details}`;
        if (xpEarned > 0) badgeName = 'Creative Artist';
        break;
    }

    if (xpEarned > 0) {
      addXP(xpEarned, activityName);
      if (badgeName) addBadge(badgeName);
      console.log(`${activityName} completed! Earned ${xpEarned} XP.`);
    } else {
      console.log(`${activityName} activity performed. No XP earned.`);
    }

    setActiveLearningActivity(null); // Go back to learning hub selection
    setActiveLessonTopic(null); // Clear active lesson topic
  };


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserName(newName);
    setUserProgress(prev => ({ ...prev, name: newName }));
    localStorage.setItem('learnPlayWorldUserName', newName);
  };

  const handleOutfitPurchase = (outfit: CharacterOutfit) => {
    if (userProgress.xp >= outfit.cost && outfit.id !== currentOutfit.id) {
      setUserProgress(prev => ({ ...prev, xp: prev.xp - outfit.cost }));
      setCurrentOutfit(outfit);
      alert(`You've unlocked the ${outfit.name}!`);
    } else if (outfit.id === currentOutfit.id) {
      alert(`You're already wearing the ${outfit.name}!`);
    } else {
      alert(`Not enough XP! You need ${outfit.cost - userProgress.xp} more XP.`);
    }
  };

  const handleResetAllProgress = useCallback(() => {
    if (window.confirm("Are you sure you want to reset ALL progress and settings? This cannot be undone!")) {
      // Clear all relevant localStorage items
      localStorage.removeItem('learnPlayWorldUserName');
      localStorage.removeItem('learnPlayWorldProgress');
      localStorage.removeItem('learnPlayWorldCurrentOutfit');
      localStorage.removeItem('learnPlayWorldSafeMode');
      localStorage.removeItem('learnPlayWorldScreenTimeLimit');
      localStorage.removeItem('learnPlayWorldLeaderboardDisabled');
      localStorage.removeItem('learnPlayWorldFocusSubject');
      localStorage.removeItem('learnPlayWorldDifficulty');

      // Reset all states to initial values
      setUserName('Young Learner');
      setUserProgress({
        name: 'Young Learner',
        xp: 0,
        badges: [],
        recentActivities: [],
      });
      setCurrentOutfit(INITIAL_CHARACTER_OUTFITS[0]);
      setIsSafeMode(true);
      setScreenTimeLimitMinutes(60);
      setIsLeaderboardDisabled(false);
      setLearningPlanFocusSubject('Math');
      setLearningPlanDifficulty('Easy');
      
      setCurrentSection(AppSection.HOME); // Go back to home after reset
      alert("All progress and settings have been reset.");
    }
  }, []);

  const renderSection = () => {
    switch (currentSection) {
      case AppSection.HOME:
        return (
          <div className="p-4 md:p-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full text-center">
              <h2 className="text-3xl font-extrabold text-blue-700 mb-4 animate-fade-in-down">Welcome to Learn & Play World!</h2>
              <p className="text-lg text-gray-700 mb-6">Your adventure begins here. Choose an activity or check your progress!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button onClick={() => setCurrentSection(AppSection.GAME_ZONE)} variant="primary" size="lg" icon={<span role="img" aria-label="gamepad">🎮</span>}>Play Games</Button>
                <Button onClick={() => setCurrentSection(AppSection.LEARNING_HUB)} variant="secondary" size="lg" icon={<span role="img" aria-label="book">📚</span>}>Learn Topics</Button>
                <Button onClick={() => setCurrentSection(AppSection.REWARDS)} variant="primary" size="lg" icon={<span role="img" aria-label="trophy">🏅</span>}>My Rewards</Button>
                <Button onClick={() => setCurrentSection(AppSection.PARENTS)} variant="outline" size="lg" icon={<span role="img" aria-label="parents">👨‍👩‍👧</span>}>For Parents</Button>
              </div>
            </Card>

            <Card className="col-span-full lg:col-span-1">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Your Progress</h3>
              <ProgressBar value={userProgress.xp} max={500} label="XP Points" className="mb-4" barColor="bg-yellow-400" />
              <p className="text-lg text-gray-700">Total XP: <span className="font-bold text-yellow-600">{userProgress.xp}</span></p>
              <h4 className="text-xl font-semibold text-purple-600 mt-6 mb-3">Badges Earned</h4>
              <div className="flex flex-wrap gap-2">
                {userProgress.badges.length > 0 ? (
                  userProgress.badges.map((badge, index) => (
                    <span key={index} className="bg-green-200 text-green-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <span role="img" aria-label="badge">⭐</span> {badge}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No badges yet! Keep learning!</p>
                )}
              </div>
            </Card>

            <Card className="col-span-full lg:col-span-2">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Recent Activities</h3>
              <ul className="space-y-2">
                {userProgress.recentActivities.length > 0 ? (
                  userProgress.recentActivities.map((activity, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-lg flex items-center gap-2">
                      <span role="img" aria-label="activity icon">✅</span>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No recent activities. Let's start playing!</p>
                )}
              </ul>
            </Card>
          </div>
        );
      case AppSection.GAME_ZONE:
        // Fix: Use 'as const' to ensure TypeScript infers the precise literal types for 'type' properties,
        // which matches the `activeGame` state's union type (`ToddlerGameType | 'quiz'`).
        const gameChoices = [
          {
            type: ToddlerGameType.ABC,
            icon: '🅰️',
            title: 'ABC Fun',
            description: 'Learn letters and sounds!',
            component: <ABCGame onGameComplete={handleGameComplete} />,
          },
          {
            type: ToddlerGameType.NUMBERS,
            icon: '🔢',
            title: '123 Adventure',
            description: 'Count and recognize numbers!',
            component: <NumberGame onGameComplete={handleGameComplete} />,
          },
          {
            type: ToddlerGameType.COLORS,
            icon: '🎨',
            title: 'Color Match',
            description: 'Discover and match colors!',
            component: <ColorGame onGameComplete={handleGameComplete} />,
          },
          {
            type: ToddlerGameType.SNAKE,
            icon: '🐍',
            title: 'Snake Classic',
            description: 'Grow your snake and avoid obstacles!',
            component: <SnakeGame onGameComplete={handleGameComplete} />,
          },
          {
            type: 'quiz',
            icon: '🧠',
            title: 'Quiz Challenge',
            description: 'Test your knowledge!',
            component: <QuizGame category="general knowledge" difficulty="easy" onQuizComplete={handleGameComplete} onBackToGames={() => setActiveGame(null)} />,
          },
        ] as const;

        return (
          <div className="p-4 md:p-8">
            <h2 className="text-3xl font-extrabold text-blue-700 text-center mb-8">Game Zone! Pick your adventure!</h2>
            {activeGame === null ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {gameChoices.map(game => (
                  <Card
                    key={game.type}
                    className="text-center p-5 cursor-pointer hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setActiveGame(game.type)}
                  >
                    <span className="text-5xl mb-4 block" role="img" aria-label="game icon">{game.icon}</span>
                    <h3 className="text-xl font-bold text-purple-700 mb-2">{game.title}</h3>
                    <p className="text-gray-600 text-sm">{game.description}</p>
                    <Button variant="primary" size="md" className="mt-4">Play Now!</Button>
                  </Card>
                ))}
              </div>
            ) : (
              // Render the active game component
              gameChoices.find(g => g.type === activeGame)?.component
            )}
          </div>
        );
      case AppSection.LEARNING_HUB:
        return (
          <div className="p-4 md:p-8">
            <h2 className="text-3xl font-extrabold text-green-700 text-center mb-8">Learning Hub: Explore New Topics!</h2>

            {activeLearningActivity === null ? (
              // Learning Hub main menu
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Interactive Lessons */}
                <Card className="p-5 text-center flex flex-col items-center">
                  <span className="text-5xl mb-4 block" role="img" aria-label="book">📚</span>
                  <h3 className="text-xl font-bold text-blue-700 mb-3">Interactive Lessons</h3>
                  <p className="text-gray-700 mb-4">Learn about new topics with Luno the Lion!</p>
                  <div className="space-y-2 w-full">
                    {LESSON_TOPICS.map(topic => (
                      <Button
                        key={topic.id}
                        onClick={() => {
                          setActiveLearningActivity(LearningActivityType.INTERACTIVE_LESSON);
                          setActiveLessonTopic(topic);
                        }}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        Start {topic.title}
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Interactive Stories */}
                <Card className="p-5 text-center flex flex-col items-center">
                  <span className="text-5xl mb-4 block" role="img" aria-label="story">🧚</span>
                  <h3 className="text-xl font-bold text-purple-700 mb-3">Interactive Stories</h3>
                  <p className="text-gray-700 mb-4">Choose your adventure and shape the story!</p>
                  <Button
                    onClick={() => setActiveLearningActivity(LearningActivityType.INTERACTIVE_STORY)}
                    variant="primary"
                    size="md"
                    className="mt-2"
                  >
                    Read a Story
                  </Button>
                </Card>

                {/* Drawing Pad */}
                <Card className="p-5 text-center flex flex-col items-center">
                  <span className="text-5xl mb-4 block" role="img" aria-label="drawing">✍️</span>
                  <h3 className="text-xl font-bold text-orange-700 mb-3">Drawing Pad</h3>
                  <p className="text-gray-700 mb-4">Unleash your creativity and draw anything!</p>
                  <Button
                    onClick={() => setActiveLearningActivity(LearningActivityType.DRAWING_PAD)}
                    variant="outline"
                    size="md"
                    className="mt-2 border-orange-500 text-orange-700 hover:bg-orange-100"
                  >
                    Start Drawing
                  </Button>
                </Card>

                {/* Fun Fact Display remains as a passive element */}
                <FunFactDisplay topic="space" />
              </div>
            ) : (
              // Render active learning activity
              activeLearningActivity === LearningActivityType.INTERACTIVE_LESSON && activeLessonTopic ? (
                <InteractiveLesson
                  topicId={activeLessonTopic.id}
                  topicTitle={activeLessonTopic.title}
                  onLessonComplete={handleLearningComplete}
                  onBack={() => setActiveLearningActivity(null)}
                />
              ) : activeLearningActivity === LearningActivityType.INTERACTIVE_STORY ? (
                <Storyteller
                  onStoryComplete={handleLearningComplete}
                  onBack={() => setActiveLearningActivity(null)}
                />
              ) : activeLearningActivity === LearningActivityType.DRAWING_PAD ? (
                <DrawingPad
                  onDrawingComplete={handleLearningComplete}
                  onBack={() => setActiveLearningActivity(null)}
                />
              ) : null
            )}
          </div>
        );
      case AppSection.REWARDS:
        return (
          <div className="p-4 md:p-8">
            <h2 className="text-3xl font-extrabold text-yellow-700 text-center mb-8">My Rewards & Achievements!</h2>
            <Card className="mb-8 p-6 text-center">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4">Your XP: {userProgress.xp} points</h3>
              <p className="text-lg text-gray-700">Keep earning XP to unlock new content!</p>
              <div className="mt-6">
                <img src={currentOutfit.image} alt="Virtual Pet/Avatar" className="mx-auto w-32 h-32 rounded-full border-4 border-purple-400 object-cover mb-4" />
                <h4 className="text-xl font-bold text-purple-700">Current Outfit: {currentOutfit.name}</h4>
              </div>
            </Card>

            <Card className="mb-8 p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Badge Collection</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {userProgress.badges.length > 0 ? (
                  userProgress.badges.map((badgeName, index) => (
                    <RewardItem
                      key={index}
                      name={badgeName}
                      imageSrc={`https://picsum.photos/seed/${badgeName}/100/100`} // Placeholder image
                      description={`Earned for a special achievement!`}
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 text-lg">No badges yet! Play games and learn to earn some!</p>
                )}
                {/* Example of an unearned badge */}
                <RewardItem name="First Step" imageSrc="https://picsum.photos/seed/firststep/100/100?grayscale" description="Complete your first lesson" />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Unlock New Outfits!</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {availableOutfits.map(outfit => (
                  <div key={outfit.id} className={`bg-gray-50 rounded-lg p-3 text-center border-2 ${currentOutfit.id === outfit.id ? 'border-purple-500' : 'border-gray-200'}`}>
                    <img src={outfit.image} alt={outfit.name} className="w-24 h-24 mx-auto mb-2 object-cover rounded-full" />
                    <h4 className="font-semibold text-gray-800">{outfit.name}</h4>
                    <p className="text-sm text-yellow-600 font-bold mb-2">XP: {outfit.cost}</p>
                    <Button
                      onClick={() => handleOutfitPurchase(outfit)}
                      variant={currentOutfit.id === outfit.id ? "secondary" : "primary"}
                      size="sm"
                      disabled={userProgress.xp < outfit.cost && currentOutfit.id !== outfit.id}
                      className="text-xs py-1 px-3"
                    >
                      {currentOutfit.id === outfit.id ? 'Wearing' : (userProgress.xp >= outfit.cost ? 'Wear Now' : 'Get More XP')}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );
      case AppSection.PARENTS:
        return (
          <div className="p-4 md:p-8">
            <h2 className="text-3xl font-extrabold text-purple-700 text-center mb-8">Parent Dashboard</h2>
            <Card className="mb-6 p-6">
              <h3 className="text-2xl font-bold text-blue-600 mb-4">Child's Progress Tracking</h3>
              <p className="text-lg text-gray-700 mb-2">Current XP: <span className="font-bold text-yellow-600">{userProgress.xp}</span></p>
              <p className="text-lg text-gray-700 mb-2">Badges Collected: <span className="font-bold text-green-600">{userProgress.badges.length}</span></p>
              <div className="mt-4">
                <label htmlFor="childName" className="block text-gray-700 font-medium mb-1">Child's Name:</label>
                <input
                  id="childName"
                  type="text"
                  value={userName}
                  onChange={handleNameChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <h4 className="text-xl font-semibold text-purple-600 mt-6 mb-3">Recent Activities</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                 {userProgress.recentActivities.length > 0 ? (
                  userProgress.recentActivities.map((activity, index) => (
                    <li key={index} className="text-gray-700">{activity}</li>
                  ))
                ) : (
                  <p className="text-gray-500">No recent activities.</p>
                )}
              </ul>
            </Card>

            <Card className="mb-6 p-6">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Custom Learning Plan</h3>
              <div className="mb-4">
                <label htmlFor="focusSubject" className="block text-gray-700 font-medium mb-1">Focus Subject:</label>
                <select
                  id="focusSubject"
                  value={learningPlanFocusSubject}
                  onChange={(e) => setLearningPlanFocusSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="Math">Math</option>
                  <option value="Reading">Reading</option>
                  <option value="Science">Science</option>
                  <option value="World Exploration">World Exploration</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-1">Difficulty:</label>
                <select
                  id="difficulty"
                  value={learningPlanDifficulty}
                  onChange={(e) => setLearningPlanDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <Button onClick={handleSaveLearningPlan} variant="primary" size="md" className="w-full">Save Plan</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4">Parental Controls</h3>
              <div className="space-y-4">
                <ToggleSwitch label="Safe Mode (Content Filtering)" initialState={isSafeMode} onToggle={setIsSafeMode} />
                <div className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg shadow-sm">
                  <span className="text-base text-gray-700 font-medium">Screen Time Limit (minutes)</span>
                  <input
                    type="number"
                    value={screenTimeLimitMinutes}
                    onChange={(e) => setScreenTimeLimitMinutes(Number(e.target.value))}
                    className="w-20 p-1 border border-gray-300 rounded-md text-center"
                    min="10"
                    max="180"
                  />
                </div>
                <ToggleSwitch label="Disable Leaderboard" initialState={isLeaderboardDisabled} onToggle={setIsLeaderboardDisabled} />
                <Button onClick={handleResetAllProgress} variant="outline" size="md" className="w-full mt-4 border-red-400 text-red-600 hover:bg-red-50">Reset All Progress</Button>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col flex-grow min-h-screen pb-24 sm:pb-28"> {/* Added padding for fixed navbar */}
      <AudioPlayer src="/lullaby.mp3" /> {/* Placeholder music file */}
      <Header userName={userName} />
      <main className="flex-grow overflow-auto">
        {renderSection()}
      </main>
      <Navbar currentSection={currentSection} onNavigate={setCurrentSection} />
    </div>
  );
};

export default App;