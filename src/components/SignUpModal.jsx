import React, { useCallback, useEffect, useRef, useState } from "react";
import "../styles/signUpModal.css";
import axios from "axios";
import styles from "../styles/SignUp.module.css";
import { Collapse } from "react-collapse";
import "../components/javascript/signUp";
import FilterButton from "./FilterButton";
import FilteredItems from "./FilteredItems";
import "../styles/SignUp.css";
import ReCAPTCHA from "react-google-recaptcha";
import { getUserInterested } from "../APIs/userinfo";

export default function SignUpModal(props) {
  const [hide, setHide] = useState(true);
  const [email, setEmail] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [password, setPassword] = useState("");
  const [index, setIndex] = useState(0);
  const [screens, setScreens] = useState();

  const [fields, setFields] = useState([]);
  const [fieldsPlan, setFieldsPlan] = useState([]);
  const [fieldsDesign, setFieldsDesign] = useState([]);
  const [fieldsDevelop, setFieldsDevelop] = useState([]);
  const [fieldsGuitar, setFieldsGuitar] = useState([]);

  function onChange(value) {
    // value로 확인 필요. 추후 수정
    setCaptchaDone(true);
  }

  const [field, setField] = useState([
    ["개발 기획", "서비스 기획", "프로덕트 기획", "영업 기획"],
    ["UX 디자인", "UI 디자인", "프로덕트 디자인", "편집 디자인"],
    [
      "프론트엔드",
      "백엔드",
      "머신러닝",
      "AI 개발",
      "QA 엔진",
      "IOS 개발",
      "Android 개발",
    ],
    ["일렉 기타", "어쿠스틱 기타", "클래식 기타"],
  ]);
  const [buttons, setButtons] = useState([
    { id: 0, value: false },
    { id: 1, value: false },
    { id: 2, value: false },
    { id: 3, value: false },
  ]);

  // recaptcha
  // https://blog.logrocket.com/implement-recaptcha-react-application/
  const key = "6LeIzgYnAAAAAMv6ze8tOqS64aXEXywgRhmBMoiJ";
  const [captchaDone, setCaptchaDone] = useState(false);

  // 두번째 화면에서 세번째 화면으로 넘어가면 "관심 분야를 알려 주세요!" 화면이 3초 뒤 열림. 이를 위해 변수 선언.
  // 또한 화면이 열리기 전, 화면 클릭을 막기 위해서 pointer-events : none을 줌.
  const [secondNextBtnClicked, setSecondNextBtnClicked] = useState(false);
  useEffect(() => {
    if (secondNextBtnClicked) {
      thirdScreen.current.style.pointerEvents = "none";

      setTimeout(() => {
        thirdScreen.current.style.pointerEvents = "auto";
      }, 4000);
    }
  }, [secondNextBtnClicked]);

  // 세번째 화면에서 선택된 필터들을 나타내는 state.
  const [selectedFilters, setSelectedFilters] = useState([]);

  // 선택된 필터들에 대한 인덱스를 나타내는 state.
  const [selectedFilterIndices, setSelectedFilterIndices] = useState([]);

  const addFilterItem = (item) => {
    if (selectedFilters.length >= 6) return false;
    setSelectedFilters((selectedFilters) => {
      if (!selectedFilters.includes(item)) return [...selectedFilters, item];
      else return [...selectedFilters];
    });
  };
  const addFilterIndex = (index) => {
    if (selectedFilterIndices.length >= 6) return false;
    setSelectedFilterIndices((selectedFilterIndices) => {
      if (!selectedFilterIndices.includes(index))
        return [...selectedFilterIndices, index];
      else return [...selectedFilterIndices];
    });
  };

  const deleteFilter = (item) => {
    setSelectedFilters((arr) => arr.filter((data) => data !== item));
  };
  const deleteFilterIndex = (index) => {
    setSelectedFilterIndices((arr) => arr.filter((data) => data !== index));
  };

  const [passwordWarning, setPasswordWarning] = useState("");

  const handleToggle = (id) => {
    setButtons(
      buttons.map((button) =>
        button.id === id ? { ...button, value: !button.value } : button
      )
    );
  };

  const test = () => {
    setButtons([
      { id: 0, value: true },
      { id: 1, value: true },
      { id: 2, value: true },
      { id: 3, value: true },
    ]);
  };

  const [nickName, setNickName] = useState("");
  const [nicknameDuplicated, setnicknameDuplicated] = useState(false);
  const [nickNameWarning, setNickNameWarning] = useState("");

  const secondScreen = useRef();
  const thirdScreen = useRef();

  // 분야 설정
  useEffect(() => {
    getUserInterested().then((res) => {
      setFields(res.data);
    });
  }, []);

  useEffect(() => {
    setFieldsPlan([]);
    setFieldsDesign([]);
    setFieldsDevelop([]);
    setFieldsGuitar([]);

    if (fields) {
      fields.map((field) => {
        if (field.field_category === "기획") {
          setFieldsPlan((cur) => [...cur, field]);
        } else if (field.field_category === "디자인") {
          setFieldsDesign((cur) => [...cur, field]);
        } else if (field.field_category === "개발") {
          setFieldsDevelop((cur) => [...cur, field]);
        } else {
          // 기타
          setFieldsGuitar((cur) => [...cur, field]);
        }
      });
    }
  }, [fields]);

  const checkNicknameValid = () => {
    const pattern = /^[가-힣a-zA-Z0-9]{2,10}$/;
    if (pattern.test(nickName)) {
      setNickNameWarning("");
      return true;
    } else {
      setNickNameWarning("! 올바른 형식의 닉네임이 아니에요");
      secondScreen.current.classList.add("vibration");
      setTimeout(function () {
        secondScreen.current.classList.remove("vibration");
      }, 300);
      return false;
    }
  };

  const checkNicknameDuplicated = async () => {
    return axios
      .post("/account/check-duplication", {
        name: nickName,
      })
      .then(function (response) {
        setNickNameWarning("");
        return false;
      })
      .catch(function (error) {
        setNickNameWarning("!아쉽지만 중복되는 닉네임이네요");
        return true;
      });
  };

  const checkEmailValid = () => {
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    if (pattern.test(email)) {
      setEmailWarning("");
      return true;
    } else {
      setEmailWarning("! 올바른 형식의 이메일이 아니에요");
      return false;
    }
  };

  const checkEmailDuplicated = async () => {
    return axios
      .post("/account/check-email-duplication", {
        email: email,
      })
      .then((response) => {
        return false;
      })
      .catch((error) => {
        setEmailWarning("! 이미 존재하는 이메일이에요");
        return true;
      });
  };

  const signUp = async () => {
    let current = new Date();
    let cDate =
      current.getFullYear() +
      "-" +
      (current.getMonth() + 1) +
      "-" +
      current.getDate();
    let cTime =
      current.getHours() +
      ":" +
      current.getMinutes() +
      ":" +
      current.getSeconds();
    let dateTime = cDate + " " + cTime;
    return axios
      .post("/account/put", {
        email: email,
        pw: password,
        name: nickName,
        created_at: dateTime,
      })
      .then((response) => {
        console.log(response.data);
        return true;
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  };

  const checkPasswordValid = () => {
    const pattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (pattern.test(password)) {
      setPasswordWarning("");
      return true;
    } else {
      setPasswordWarning(
        "! 최소 6자리 이상의 숫자와 문자, 특수기호의 조합이 필요해요"
      );
      return false;
    }
  };

  useEffect(() => {
    // index가 변할 때마다 현재 index를 제외한 것 모두 active 클래스 제거.
    // 현재 index에는 active 클래스 추가 & z-index 조정.
    if (screens) {
      screens.map((screen, idx) => {
        if (idx === index) {
          screen.classList.add("active");
          screen.style.zIndex = 10;
        } else {
          screen.classList.remove("active");
          screen.style.zIndex = 9;
        }
        return screen;
      });
    }
  }, [index, screens]);

  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close } = props;

  useEffect(() => {
    if (open) {
      const screensList = document.querySelectorAll(".screen");
      setScreens(Object.values(screensList));
    }
  }, [open]);

  const modalRef = useRef();

  useEffect(() => {
    // 이벤트 핸들러 함수
    const handler = (e) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        close();
      }
    };

    // 이벤트 핸들러 등록
    document.addEventListener("mousedown", handler);

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener("mousedown", handler);
    };
  });

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        // <section ref={modalRef}>
        //   <main>{props.children}</main>
        //   <footer>
        //     <button className="close" onClick={close}>
        //       close
        //     </button>
        //   </footer>
        // </section>
        <section className={styles.loginBox} ref={modalRef}>
          <button
            className="absolute right-14 top-14 z-10"
            onClick={() => {
              close();
            }}
          >
            <img src="/public_assets/icons/XButton.svg" alt="XButton" />
          </button>
          <div className="walkthrough show reveal">
            <div className="walkthrough-body">
              <ul className="screens animate">
                <li className="screen active z-10">
                  <h1 className="title">시작해볼까요?</h1>
                  <section className="first-input">
                    <form className={styles.signUpInputBox}>
                      <span className="mr-auto">이메일</span>
                      <div className="relative">
                        <input
                          type="text"
                          className={styles.emailInput}
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          placeholder="ex : example@naver.com"
                        />
                        <span className={styles.warning}>{emailWarning}</span>
                      </div>
                      <div className="flex justify-between mt-5">
                        <span>비밀번호</span>
                        <div
                          className="flex gap-1 cursor-pointer"
                          onClick={() => {
                            setHide(!hide);
                          }}
                        >
                          {hide ? (
                            <img
                              src="/public_assets/icons/hide.svg"
                              alt="kakao"
                            />
                          ) : (
                            <img
                              src="/public_assets/icons/show.svg"
                              alt="kakao"
                            />
                          )}
                          <span>숨기기</span>
                        </div>
                      </div>
                      <span className="relative">
                        <input
                          type={hide ? "password" : "text"}
                          className={styles.passwordInput}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          placeholder="최소 6자리 이상의 숫자와 문자, 특수기호의 조합"
                        />
                        <span className={styles.warning}>
                          {passwordWarning}
                        </span>
                      </span>
                    </form>
                  </section>
                  <button
                    className="mr-auto ml-auto"
                    onClick={() => {
                      if (checkEmailValid() && checkPasswordValid()) {
                        // 유효성 검사 둘다 통과. 이제 이메일 중복 테스트 하면 됨.
                        checkEmailDuplicated().then((duplicated) => {
                          if (!duplicated) {
                            setIndex((cur) => {
                              return cur + 1;
                            });
                          }
                        });
                      }
                    }}
                  >
                    <img src="/public_assets/icons/nextBtn.svg" alt="nextBtn" />
                  </button>
                </li>
                <li className="screen secondScreen" ref={secondScreen}>
                  <h1 className="title">닉네임을 정해보아요</h1>
                  <section className="flex mr-auto ml-auto items-center">
                    <span className="relative">
                      <input
                        type="text"
                        placeholder="2-10자리의 숫자와 문자, 한글의 조합"
                        className="input ml-auto mr-auto"
                        value={nickName}
                        onChange={(e) => {
                          setNickName(e.target.value);
                        }}
                      />
                      <span className="nickNameWarning">{nickNameWarning}</span>
                    </span>
                    <button
                      onClick={() => {
                        // 닉네임 중복 api 호출.
                        // 중복되지 않을 시 setIndex를 통해 다음 슬라이드로 넘어 감.
                        // 중복될 시 nicknameDuplicated를 true로 만들어 주고, 간단한 진동 효과 넣어 줌.

                        if (!checkNicknameValid()) return;

                        checkNicknameDuplicated().then((duplicated) => {
                          if (duplicated) {
                            secondScreen.current.classList.add("vibration");

                            setTimeout(function () {
                              secondScreen.current.classList.remove(
                                "vibration"
                              );
                            }, 300);
                          } else {
                            setIndex((cur) => {
                              return cur + 1;
                            });
                            setSecondNextBtnClicked(true);
                            setTimeout(() => {
                              test();
                            }, 3000);
                          }
                        });
                      }}
                      className="button"
                    >
                      <img
                        src="/public_assets/icons/nextBtn.svg"
                        alt="nextBtn"
                      />
                    </button>
                  </section>
                </li>

                <li className="screen thirdScreen" ref={thirdScreen}>
                  <h1 className={`title ${secondNextBtnClicked && "up"}`}>
                    {nickName} <br /> 님의 관심 분야를 알려주세요!
                  </h1>
                  <ul className="flex ml-auto mr-auto gap-10">
                    <li
                      className={`relative filterContainer ${
                        secondNextBtnClicked && "up"
                      }`}
                    >
                      <button
                        className={`fieldBtn ${
                          buttons && buttons[0].value && "coloredFieldBtn"
                        }`}
                        onClick={() => {
                          handleToggle(0);
                        }}
                      >
                        기획
                      </button>
                      <Collapse isOpened={buttons && buttons[0].value}>
                        <ul className={`fields`}>
                          {/* item은 각각의 이름. */}
                          {fieldsPlan &&
                            fieldsPlan.map((item, idx) => (
                              <FilterButton
                                item={item.title}
                                key={idx}
                                addFilterIndex={addFilterIndex}
                                addFilterItem={addFilterItem}
                                colored={
                                  selectedFilters &&
                                  selectedFilters.includes(item.title) &&
                                  true
                                }
                                deleteFilter={deleteFilter}
                                deleteFilterIndex={deleteFilterIndex}
                                index={item.index}
                              />
                            ))}
                        </ul>
                      </Collapse>
                    </li>
                    <li
                      className={`relative filterContainer ${
                        secondNextBtnClicked && "up"
                      }`}
                    >
                      <button
                        className={`fieldBtn ${
                          buttons && buttons[1].value && "coloredFieldBtn"
                        }`}
                        onClick={() => {
                          handleToggle(1);
                        }}
                      >
                        디자인
                      </button>
                      <Collapse isOpened={buttons && buttons[1].value}>
                        <ul className={`fields`}>
                          {fieldsDesign &&
                            fieldsDesign.map((item, idx) => (
                              <FilterButton
                                item={item.title}
                                key={idx}
                                addFilterIndex={addFilterIndex}
                                addFilterItem={addFilterItem}
                                colored={
                                  selectedFilters &&
                                  selectedFilters.includes(item.title) &&
                                  true
                                }
                                deleteFilter={deleteFilter}
                                deleteFilterIndex={deleteFilterIndex}
                                index={item.index}
                              />
                            ))}
                        </ul>
                      </Collapse>
                    </li>
                    <li
                      className={`relative filterContainer ${
                        secondNextBtnClicked && "up"
                      }`}
                    >
                      <button
                        className={`fieldBtn ${
                          buttons && buttons[2].value && "coloredFieldBtn"
                        }`}
                        onClick={() => {
                          handleToggle(2);
                        }}
                      >
                        개발
                      </button>
                      <Collapse isOpened={buttons && buttons[2].value}>
                        <ul className={`fields`}>
                          {fieldsDevelop &&
                            fieldsDevelop.map((item, idx) => (
                              <FilterButton
                                item={item.title}
                                key={idx}
                                addFilterIndex={addFilterIndex}
                                addFilterItem={addFilterItem}
                                colored={
                                  selectedFilters &&
                                  selectedFilters.includes(item.title) &&
                                  true
                                }
                                deleteFilter={deleteFilter}
                                deleteFilterIndex={deleteFilterIndex}
                                index={item.index}
                              />
                            ))}
                        </ul>
                      </Collapse>
                    </li>
                    <li
                      className={`relative filterContainer ${
                        secondNextBtnClicked && "up"
                      }`}
                    >
                      <button
                        className={`fieldBtn ${
                          buttons && buttons[3].value && "coloredFieldBtn"
                        }`}
                        onClick={() => {
                          handleToggle(3);
                        }}
                      >
                        기타
                      </button>
                      <Collapse isOpened={buttons && buttons[3].value}>
                        <ul className={`fields`}>
                          {fieldsGuitar &&
                            fieldsGuitar.map((item, idx) => (
                              <FilterButton
                                item={item.title}
                                key={idx}
                                addFilterIndex={addFilterIndex}
                                addFilterItem={addFilterItem}
                                colored={
                                  selectedFilters &&
                                  selectedFilters.includes(item.title) &&
                                  true
                                }
                                deleteFilter={deleteFilter}
                                deleteFilterIndex={deleteFilterIndex}
                                index={item.index}
                              />
                            ))}
                        </ul>
                      </Collapse>
                    </li>
                  </ul>
                  {/* 선택된 필터들 보여주는 곳 */}
                  {selectedFilters && selectedFilters.length !== 0 && (
                    <FilteredItems
                      selectedFilters={selectedFilters}
                      deleteFilter={deleteFilter}
                    />
                  )}
                  <button
                    onClick={() => {
                      setIndex((cur) => {
                        return cur + 1;
                      });
                    }}
                    className={`button bigButton ${styles.thirdScreenBtn}
                    ${secondNextBtnClicked && "up"}
                    `}
                  >
                    <img src="/public_assets/icons/nextBtn.svg" alt="nextBtn" />
                  </button>
                </li>
                <li className="screen">
                  <h1 className="title">시작해 볼까요?</h1>
                  <form className="mr-auto ml-auto">
                    <ReCAPTCHA sitekey={key} onChange={onChange} />
                  </form>
                  <button
                    className="mr-auto ml-auto mt-8"
                    onClick={async () => {
                      if (!captchaDone) {
                        alert("체크박스를 먼저 클릭해 주세요!");
                        return;
                      }

                      if ((await signUp()) !== false) {
                        setIndex((cur) => {
                          setTimeout(() => {
                            close();
                            window.location.reload();
                          }, 3000);
                          return cur + 1;
                        });
                      }
                    }}
                  >
                    <img src="/public_assets/icons/nextBtn.svg" alt="nextBtn" />
                  </button>
                </li>
                <li className="screen">
                  <h1 className="title">가입이 완료되었어요!</h1>
                </li>
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
