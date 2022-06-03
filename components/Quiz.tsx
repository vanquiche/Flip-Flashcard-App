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
import React, { useState, useRef, useEffect } from 'react';

import QuizContainer from './QuizContainer';
import QuizCard from './QuizCard';
import Results from './Results';
import QuizStartPage from './QuizStartPage';
import AlertDialog from './AlertDialog';

import { Flashcard } from './types';

interface Props {
  navigation: any;
  cards: Flashcard[];
  color?: string;
  set?: string;
  onDismiss: () => void;
}

const Quiz: React.FC<Props> = ({
  navigation,
  onDismiss,
  cards,
  color,
  set,
}) => {
  const { colors } = useTheme();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [startQuiz, setStartQuiz] = useState(false);
  const [completeQuiz, setCompleteQuiz] = useState(false);
  const [cardCount, setCardCount] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [result, setResult] = useState('')

  const score = useRef(0);

  const lastSlide = cardCount === flashcards.length - 1;

  const checkAnswer = () => {
    if (submitted) return;

    // check and remove trailing space and set to lowercase
    const userInput = answer.replace(/[ \t]+$/gm, '').toLowerCase();
    const solution = flashcards[cardCount].solution.toLowerCase();
    if (userInput === solution) {
      setResult('Correct!')
      score.current++;
    } else {
      setResult('Incorrect!')
    }
    // console.log(userInput)
    // console.log(solution)
    setSubmitted(true);
  };

  // ANIMATION VALUES
  const headerAnimate = useRef<any>(new Animated.Value(0)).current;
  const inputAnimate = useRef<any>(new Animated.Value(0)).current;
  const tabAnimate = useRef<any>(new Animated.Value(0)).current;

  const resetTab = () => {
    Animated.spring(tabAnimate, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };
  const slideTabDown = () => {
    Animated.spring(tabAnimate, {
      toValue: 70,
      useNativeDriver: true,
    }).start();
  };

  const slideHeaderUp = () => {
    Animated.spring(headerAnimate, {
      toValue: -70,
      useNativeDriver: true,
    }).start();
  };

  const resetHeader = () => {
    Animated.spring(headerAnimate, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

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

  useEffect(() => {
    // slide header and tab out of view
    slideHeaderUp();
    slideTabDown();
    // slide header up
    navigation.setOptions({
      headerStyle: {
        transform: [{ translateY: headerAnimate }],
        backgroundColor: colors.primary,
        height: 70,
      },
    });
    // slide tab down
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        transform: [{ translateY: tabAnimate }],
        backgroundColor: colors.primary,
        height: 70
      },
    });

    return () => {
      // return header and tab to original position
      resetHeader();
      resetTab();
      // slide header down
      navigation.setOptions({
        headerStyle: {
          transform: [{ translateY: headerAnimate }],
          backgroundColor: colors.primary,
          height: 70,
        },
      });
      // slide tab up
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          transform: [{ translateY: tabAnimate }],
          backgroundColor: colors.primary,
          height: 70
        },
      });
    };
  }, [navigation]);

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
  }, [Keyboard]);

  return (
    <Portal>
      <QuizContainer>
        <View style={styles.container}>
          <AlertDialog
            message='Are you sure you want to quit?'
            visible={showAlert}
            onConfirm={onDismiss}
            onDismiss={() => setShowAlert(false)}
          />
          {/* CLOSE QUIZ */}
          <IconButton
            icon='close-box'
            onPress={() => setShowAlert(true)}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />

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
                  total={flashcards.length}
                  score={score.current}
                  dismiss={onDismiss}
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
                    color={color}
                    card={flashcards[cardCount]}
                    key={flashcards[cardCount]._id}
                    canFlip={submitted}
                    next={submitted}
                    result={result}
                    slideRemaining={lastSlide}
                    showSolution={submitted}
                    nextCard={() => {
                      setAnswer('');
                      setSubmitted(false);
                      setCardCount((prev) => prev + 1);
                    }}
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
                        onPress={() => setCompleteQuiz(true)}
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
    // backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  input: {
    width: 275,
  },
});

export default Quiz;
