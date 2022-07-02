import { View, Text, StyleSheet, Animated, Keyboard } from 'react-native';
import {
  Portal,
  useTheme,
  IconButton,
  TextInput,
  Title,
  ProgressBar,
  Button,
} from 'react-native-paper';
import React, { useState, useRef, useEffect, useMemo } from 'react';

import QuizContainer from './QuizContainer';
import QuizCard from './QuizCard';
import Results from './Results';
import QuizStartPage from './QuizStartPage';
import AlertDialog from './AlertDialog';

import { Flashcard, StackNavigationTypes } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import db from '../db-services';
import { updateUser } from '../redux/userThunkActions';
import { updateCard } from '../redux/cardThunkActions';
import { showNotification } from '../redux/storeSlice';
import checkForLevelUp from '../utility/checkForLevelUp';

interface Props {
  navigation: any;
  categoryRef: string;
  setRef: string;
  cards: Flashcard[];
  categoryXP: number;
  pattern: string;
  color: string;
  set?: string;
  onDismiss: () => void;
}

const Quiz: React.FC<Props> = ({
  navigation,
  categoryRef,
  setRef,
  onDismiss,
  categoryXP,
  cards,
  pattern,
  color,
  set,
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cardCount, setCardCount] = useState(0);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');

  // VIEW STATE
  const [startQuiz, setStartQuiz] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [completeQuiz, setCompleteQuiz] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user, cards: quiz, levelUpCondition } = useSelector((state: RootState) => state.store);

  // const originalHeaderStyle = {
  //   backgroundColor: user.theme.headerColor,
  //   height: 70,
  // }

  // const originalTabBarStyle = {
  //   backgroundColor: user.theme.tabColor,
  //   height: 70,
  // }

  const selectedQuizSet = useMemo(() => {
    return quiz.set.find((c) => c._id === setRef);
  }, []);

  const { colors } = useTheme();
  const score = useRef(0);

  const lastSlide = cardCount === flashcards.length - 1;

  const checkAnswer = () => {
    if (submitted) return;

    // check and remove trailing space and set to lowercase
    const userInput = answer.replace(/[ \t]+$/gm, '').toLowerCase();
    const solution = flashcards[cardCount].solution.toLowerCase();
    if (userInput === solution) {
      setResult('Correct!');
      score.current++;
    } else {
      setResult('Incorrect!');
    }
    setSubmitted(true);
  };

  const goToNextSlide = () => {
    setAnswer('');
    setSubmitted(false);
    setCardCount((prev) => prev + 1);
  };

  const submitResults = () => {
    setCompleteQuiz(true);
    // if quiz has not been taken today then award points
    if (!user.completedQuiz.includes(setRef)) {
      let awardHeartCoin = 0;
      const awardPoints = score.current;
      const leveledUp = checkForLevelUp(user.xp, awardPoints, levelUpCondition);
      if (leveledUp) {
        awardHeartCoin = 10 * leveledUp;
      }
      const update = [...user.completedQuiz, setRef];

      // add points to category
      dispatch(
        updateCard({
          id: categoryRef,
          type: 'category',
          query: { points: awardPoints + categoryXP },
        })
        );
        // add points to user
        // add set to reference
      // can only earn points once/day
      dispatch(
        updateUser({
          completedQuiz: update,
          xp: user.xp + awardPoints,
          heartcoin: awardHeartCoin,
        })
      );
    }
  };

  // ANIMATION VALUES
  // const headerAnimate = useRef<any>(new Animated.Value(0)).current;
  const inputAnimate = useRef<any>(new Animated.Value(0)).current;
  // const tabAnimate = useRef<any>(new Animated.Value(0)).current;

  // const resetTab = () => {
  //   Animated.spring(tabAnimate, {
  //     toValue: 0,
  //     useNativeDriver: true,
  //   }).start();
  // };
  // const slideTabDown = () => {
  //   Animated.spring(tabAnimate, {
  //     toValue: 70,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const slideHeaderUp = () => {
  //   Animated.spring(headerAnimate, {
  //     toValue: -70,
  //     useNativeDriver: true,
  //   }).start();
  // };

  // const resetHeader = () => {
  //   Animated.spring(headerAnimate, {
  //     toValue: 0,
  //     useNativeDriver: true,
  //   }).start();
  // };

  const slideDialogUp = () => {
    Animated.spring(inputAnimate, {
      toValue: -100,
      useNativeDriver: true,
    }).start();
  };

  const slideDialogDown = () => {
    Animated.spring(inputAnimate, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // // start animation to hide header and tabbar when quiz begins
  // useEffect(() => {
  //   // slide header and tab out of view
  //   slideHeaderUp();
  //   slideTabDown();
  //   // slide header up
  //   navigation.setOptions({
  //     headerStyle: {
  //       transform: [{ translateY: headerAnimate }],
  //       // backgroundColor: user.theme.headerColor,
  //       // height: 70,
  //       ...originalHeaderStyle
  //     },
  //   });
  //   // slide tab down
  //   navigation.getParent()?.setOptions({
  //     tabBarStyle: {
  //       transform: [{ translateY: tabAnimate }],
  //       backgroundColor: user.theme.tabColor,
  //       height: 70,
  //       // ...originalTabBarStyle
  //     },
  //   });

  //   return () => {
  //     // return header and tab to original position
  //     resetHeader();
  //     resetTab();
  //     // slide header down
  //     navigation.setOptions({
  //       headerStyle: {
  //         transform: [{ translateY: headerAnimate }],
  //         // backgroundColor: colors.primary,
  //         // height: 70,
  //         ...originalHeaderStyle
  //       },
  //     });
  //     // slide tab up
  //     navigation.getParent()?.setOptions({
  //       tabBarStyle: {
  //         transform: [{ translateY: tabAnimate }],
  //         backgroundColor: user.theme.tabColor,
  //         height: 70,
  //         // ...originalTabBarStyle
  //       },
  //     });
  //   };
  // }, [navigation]);

  // shuffle cards in random order
  useEffect(() => {
    const shuffleArray = (array: Flashcard[]) => {
      let shuffled = [...array];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setFlashcards(shuffled);
    };
    shuffleArray(cards);
  }, [cards]);

  // shift component out of keyboard view
  useEffect(() => {
    const slideInputUp = Keyboard.addListener(
      'keyboardWillShow',
      slideDialogUp
    );
    const resetInput = Keyboard.addListener(
      'keyboardWillHide',
      slideDialogDown
    );

    return () => {
      slideInputUp.remove();
      resetInput.remove();
    };
  }, []);

  return (
    <Portal>
      <QuizContainer color={user.theme.bgColor}>
        <View style={styles.container}>
          <AlertDialog
            message='Are you sure you want to quit?'
            visible={showAlert}
            onConfirm={onDismiss}
            onDismiss={() => setShowAlert(false)}
          />
          {/* CLOSE QUIZ */}
          {!completeQuiz && (
            <IconButton
              icon='close-box'
              onPress={() => setShowAlert(true)}
              style={{ position: 'absolute', top: -10, left: -25 }}
            />
          )}

          {/* START AND OPEN QUIZ */}
          {!startQuiz && (
            <QuizStartPage
              title={set}
              count={flashcards.length}
              color={color}
              onPress={() => setStartQuiz(true)}
            />
          )}

          {/* QUIZ UNIT */}
          {startQuiz && (
            <Animated.View
              style={[
                {
                  transform: [{ translateY: inputAnimate }],
                  alignItems: 'center',
                },
              ]}
            >
              {/* SHOW QUIZ RESULTS */}
              {completeQuiz && (
                <Results
                  dismiss={onDismiss}
                  score={score.current}
                  total={flashcards.length}
                  set={selectedQuizSet!}
                  pointTotal={levelUpCondition}
                />
              )}

              {/* FLASHCARDS AND INPUT */}
              {!completeQuiz && (
                <View style={{ alignItems: 'center' }}>
                  <ProgressBar
                    color={color}
                    progress={(cardCount + 1) / flashcards.length}
                    style={{ width: 275, height: 6, borderRadius: 5 }}
                  />
                  <QuizCard
                    key={flashcards[cardCount]._id}
                    color={color}
                    result={result}
                    next={submitted}
                    pattern={pattern}
                    canFlip={submitted}
                    showSolution={submitted}
                    nextCard={goToNextSlide}
                    slideRemaining={lastSlide}
                    card={flashcards[cardCount]}
                  />
                  <TextInput
                    mode='outlined'
                    style={styles.input}
                    activeOutlineColor={colors.secondary}
                    outlineColor='lightgrey'
                    label='ANSWER'
                    maxLength={42}
                    value={answer}
                    onChangeText={(text) => setAnswer(text)}
                    disabled={submitted}
                  />
                  <View
                    style={{
                      width: 275,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      mode='text'
                      color={colors.secondary}
                      labelStyle={{ fontSize: 16 }}
                      onPress={() => setAnswer('')}
                      disabled={!answer ? true : submitted ? true : false}
                    >
                      Clear
                    </Button>

                    {lastSlide && submitted && (
                      <Button
                        mode='text'
                        color={colors.secondary}
                        labelStyle={{ fontSize: 16 }}
                        onPress={submitResults}
                      >
                        Results
                      </Button>
                    )}

                    <Button
                      mode='text'
                      color={colors.secondary}
                      labelStyle={{ fontSize: 16 }}
                      disabled={!answer ? true : submitted ? true : false}
                      onPress={checkAnswer}
                    >
                      Submit
                    </Button>
                  </View>
                </View>
              )}
            </Animated.View>
          )}
        </View>
      </QuizContainer>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  input: {
    width: 275,
  },
});

export default Quiz;
