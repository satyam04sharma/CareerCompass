import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import QuestionPage from './QuestionPage';
// import Modal from './Modal';
import Results from './Results';
import shuffleQuestions from '../helpers/shuffleQuestions';
import QUESTION_DATA from '../data/quiz-data';
import '../style.css';

class QuizApp extends Component {
  state = {
    ...this.getInitialState(this.props.totalQuestions)
  };

  static propTypes = {
    totalQuestions: PropTypes.number.isRequired
  };

  getInitialState(totalQuestions=5) {
    totalQuestions = Math.min(totalQuestions, QUESTION_DATA.length);
    const QUESTIONS = shuffleQuestions(QUESTION_DATA).slice(0, totalQuestions);

    return {
      questions: QUESTIONS,
      totalQuestions: totalQuestions,
      userAnswers: [],
      step: 1,
      score: 0,
      modal: {
        state: 'hide',
        praise: '',
        points: ''
      }
    };
  }

  handleAnswerClick = (index) => (e) => {
    const { questions, step, userAnswers } = this.state;
    // const isCorrect = questions[0].correct === index;
    const isCorrect = true;
    // console.log(questions[0].answers[index].props.children);
    const currentStep = step - 1;
    const tries = 0;

    if (isCorrect && e.target.nodeName === 'LI') {
      // Prevent other answers from being clicked after correct answer is clicked
      e.target.parentNode.style.pointerEvents = 'none';

      e.target.classList.add('right');
      const obj ={}
      obj[questions[0].index] = questions[0].answers[index].props.children;
      userAnswers.push(obj);
        // userAnswers[`${questions[0].index}`] = questions[0].answers[index].props.children;
    //   userAnswers[currentStep] = {
    //     // tries: tries + 1
    //   };

      this.setState({
        userAnswers: userAnswers
      });
      console.log(userAnswers)

    //   setTimeout(() => this.showModal(tries), 750);

      setTimeout(this.nextStep, 2750);
    }

    else if (e.target.nodeName === 'LI') {
      e.target.style.pointerEvents = 'none';
      e.target.classList.add('wrong');

    //   userAnswers[currentStep] = {
    //     tries: tries + 1
    //   };

      this.setState({
        userAnswers: userAnswers
      });
    }
  };

  handleEnterPress = (index) => (e) => {
    if (e.keyCode === 13) {
      this.handleAnswerClick(index)(e);
    }
  };

//   showModal = (tries) => {
//     let praise;
//     let points;

//     switch (tries) {
//       case 0: {
//         praise = '1st Try!';
//         points = '+10';
//         break;
//       }
//       case 1: {
//         praise = '2nd Try!';
//         points = '+5';
//         break;
//       }
//       case 2: {
//         praise = 'Correct!';
//         points = '+2';
//         break;
//       }
//       default: {
//         praise = 'Correct!';
//         points = '+1';
//       }
//     }

//     this.setState({
//       modal: {
//         state: 'show',
//         praise,
//         points
//       }
//     });
//   };

  nextStep = () => {
    const { questions, userAnswers, step, score } = this.state;
    const restOfQuestions = questions.slice(1);
    const currentStep = step - 1;
    const tries = 0;

    this.setState({
      step: step + 1,
      score: this.updateScore(tries, score),
      questions: restOfQuestions,
      modal: {
        state: 'hide'
      }
    });
  };

  updateScore(tries, score) {
    switch (tries) {
      case 1: return score + 10;
      case 2: return score + 5;
      case 3: return score + 2;
      default: return score + 1;
    }
  }

  restartQuiz = () => {
    this.setState({
      ...this.getInitialState(this.props.totalQuestions)
    });
  };

  render() {
    const { step, questions, userAnswers, totalQuestions, score, modal } = this.state;
    if (step >= totalQuestions + 1) {
        return (
          <Results
            score={score}
            restartQuiz={this.restartQuiz}
            userAnswers={userAnswers}
          />
        );
      } 
      else return (
      <Fragment>
        <QuestionPage
          step={step}
          questions={questions}
          totalQuestions={totalQuestions}
          score={score}
          handleAnswerClick={this.handleAnswerClick}
          handleEnterPress={this.handleEnterPress}
        />
        {/* { modal.state === 'show' && <Modal modal={modal} /> } */}
      </Fragment>
    );
  }
}

export default QuizApp;
