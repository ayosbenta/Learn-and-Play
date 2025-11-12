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
import ToggleSwitch from './components/ParentControls';
import ABCGame from './components/ABCGame';
import NumberGame from './components/NumberGame';
import ColorGame from './components/ColorGame';
import SnakeGame from './components/SnakeGame'; // New import for Snake Game
import { AppSection, UserProgress, CharacterOutfit, ToddlerGameType, GameCompletionCallback } from './types';
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

  // Simulate loading user data
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
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    localStorage.setItem('learnPlayWorldProgress', JSON.stringify(userProgress));
    localStorage.setItem('learnPlayWorldCurrentOutfit', currentOutfit.id);
  }, [userProgress, currentOutfit]);

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {LESSON_TOPICS.map(topic => (
                <Card key={topic.id} className="p-5">
                  <h3 className="text-xl font-bold text-blue-700 mb-2">{topic.title}</h3>
                  <p className="text-gray-700 mb-4">{topic.description}</p>
                  <Button onClick={() => addXP(50, topic.title)} variant="primary" size="sm">Start Lesson</Button>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-5 text-center">
                <h3 className="text-xl font-bold text-purple-700 mb-3">Interactive Stories</h3>
                <p className="text-gray-700 mb-4">Read along and embark on exciting adventures!</p>
                <Button variant="secondary" size="sm" onClick={() => addXP(30, 'Interactive Story')}>Read a Story</Button>
              </Card>
              <Card className="p-5 text-center">
                <h3 className="text-xl font-bold text-orange-700 mb-3">Drawing Pad</h3>
                <p className="text-gray-700 mb-4">Unleash your creativity and draw anything!</p>
                <div className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 h-40 flex items-center justify-center text-gray-500">
                  <p>Drawing Pad Placeholder</p>
                  {/* In a full implementation, this would be a canvas element */}
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => addXP(20, 'Drawing')}>Start Drawing</Button>
              </Card>
            </div>
            <FunFactDisplay topic="space" />
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
        const [isSafeMode, setIsSafeMode] = useState(true);
        const [screenTimeLimit, setScreenTimeLimit] = useState(60);

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
              <h4 className="text-xl font-semibold text-purple-600 mt-6 mb-3">Learning Milestones</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Completed 3 Math Missions</li>
                <li>Mastered 5 new vocabulary words</li>
                <li>Explored the Solar System lesson</li>
              </ul>
            </Card>

            <Card className="mb-6 p-6">
              <h3 className="text-2xl font-bold text-green-600 mb-4">Custom Learning Plan</h3>
              <div className="mb-4">
                <label htmlFor="focusSubject" className="block text-gray-700 font-medium mb-1">Focus Subject:</label>
                <select id="focusSubject" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option>Math</option>
                  <option>Reading</option>
                  <option>Science</option>
                  <option>World Exploration</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="difficulty" className="block text-gray-700 font-medium mb-1">Difficulty:</label>
                <select id="difficulty" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400">
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <Button variant="primary" size="md" className="w-full">Save Plan</Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4">Parental Controls</h3>
              <div className="space-y-4">
                <ToggleSwitch label="Safe Mode (Content Filtering)" initialState={isSafeMode} onToggle={setIsSafeMode} />
                <div className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg shadow-sm">
                  <span className="text-base text-gray-700 font-medium">Screen Time Limit (minutes)</span>
                  <input
                    type="number"
                    value={screenTimeLimit}
                    onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
                    className="w-20 p-1 border border-gray-300 rounded-md text-center"
                    min="10"
                    max="180"
                  />
                </div>
                <ToggleSwitch label="Disable Leaderboard" initialState={false} onToggle={() => {}} />
                <Button variant="outline" size="md" className="w-full mt-4 border-red-400 text-red-600 hover:bg-red-50">Reset All Progress</Button>
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