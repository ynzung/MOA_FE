import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import questionsData from "../../dummy/TestData.json";
import ProgressBar from "../../components/test/ProgressBar";
import OrangeBtn from "../../components/common/OrangeBtn";
import axios from "axios";

const TestPage = () => {
  const Server_IP = process.env.REACT_APP_Server_IP;
  const name = localStorage.getItem("name");
  const id = localStorage.getItem("id");
  const accessToken = localStorage.getItem("access");
  const navigate = useNavigate();

  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleOptionClick = (questionId, optionId) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionId,
    }));
  };

  const handleNextClick = () => {
    const currentQuestionId = currentQuestionIndex + 1;
    if (!answers[currentQuestionId]) {
      alert("옵션을 선택해주세요.");
      return;
    }

    if (currentQuestionIndex < questionsData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const requestBody = [
        {
          id: parseInt(id),
          name: name,
          travel_style: answers[1],
          transportation: answers[2],
          cafe_wait_time: answers[3],
          luggage_amount: answers[4],
          route_preference: answers[5],
          sea_discovery: answers[6],
          dinner_choice: answers[7],
          first_stop: answers[8],
          budget_approach: answers[9],
          trip_planning_style: answers[10],
        },
      ];
      console.log(requestBody);
      console.log(accessToken);
      axios
        .post(`${Server_IP}/api/question/test`, requestBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "content-type": "application/json",
          },
        })
        .then((response) => {
          console.log(response.data);
          alert("테스트가 완료되었습니다!");
          localStorage.setItem("trip_type", response.data[0].trip_type);
          navigate("/test/result");
        })
        .catch((error) => {
          console.error(error);
          alert("결과 전송에 실패했습니다.");
        });
    }
  };

  const currentQuestion = questionsData.questions[currentQuestionIndex];

  return (
    <div>
      <Wrapper>
        <ProgressBarWrapper>
          <ProgressBar current={currentQuestionIndex + 1} total={10} />
        </ProgressBarWrapper>
        <TestWrapper key={currentQuestion.id}>
          <TestTitle>{currentQuestion.question}</TestTitle>
          <TestOptions>
            {currentQuestion.options.map((option) => (
              <OptionLabel
                key={option.id}
                $isSelected={answers[currentQuestion.id] === option.id}
              >
                <OptionInput
                  type="radio"
                  name={`question${currentQuestion.id}`}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() =>
                    handleOptionClick(currentQuestion.id, option.id)
                  }
                />
                {option.label}
              </OptionLabel>
            ))}
          </TestOptions>
          <BtnBox>
            <OrangeBtn
              onBtnClick={handleNextClick}
              txt={
                currentQuestionIndex < questionsData.questions.length - 1
                  ? "다음 문제"
                  : "결과 보기"
              }
            />
          </BtnBox>
        </TestWrapper>
      </Wrapper>
    </div>
  );
};

export default TestPage;

const Wrapper = styled.div`
  width: 412px;
  margin: 0 auto;
  box-sizing: border-box;
  background-color: var(--beige);
`;

const ProgressBarWrapper = styled.div`
  padding: 70px 27px 16px 27px;
`;

const TestWrapper = styled.div`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TestTitle = styled.div`
  height: 55px;
  font-weight: bold;
  font-size: 20px;
  white-space: pre-line;
  text-align: center;
  margin-bottom: 85px;
`;

const TestOptions = styled.div`
  display: flex;
  height: 270px;
  gap: 30px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const OptionLabel = styled.label`
  font-size: 16px;
  border: 1px solid var(--orange);
  border-radius: 25px;
  width: 357px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: pre-line;
  cursor: pointer;
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "normal")};
  border-width: ${({ $isSelected }) => ($isSelected ? "3px" : "1px")};
  transition: 0.3s ease;

  &:hover {
    font-weight: bold;
    border-width: 3px;
    transform: scale(1.02);
  }
`;

const OptionInput = styled.input`
  display: none; /* 라디오 버튼 숨기는 스타일 설정 */
`;

const BtnBox = styled.div`
  margin: 113px 27px 60px 27px;
`;
