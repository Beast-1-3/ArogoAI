/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import API from "../services/api";
import AuthContext from "../context/AuthContext";
import Toast from "../components/Toast";
import { FiTrash2, FiClock, FiCalendar, FiPlus, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const DoctorAvailability = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get("/auth/me"); // Get doctor details
      setAvailability(data.data.availability || []);
    } catch (error) {
      console.error("Error fetching availability", error);
      setToastMessage("Failed to load your availability. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSlot = (time) => {
    if (!selectedSlots.includes(time)) {
      setSelectedSlots([...selectedSlots, time]);
    }
  };

  const handleRemoveSlot = (time) => {
    setSelectedSlots(selectedSlots.filter((slot) => slot !== time));
  };

  const handleConfirmAvailability = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      setToastMessage("Please select a date and at least one slot.");
      return;
    }

    setIsLoading(true);
    const updatedAvailability = [...availability];
    const existingDate = updatedAvailability.find(
      (a) => a.date === selectedDate
    );

    if (existingDate) {
      existingDate.slots = [
        ...new Set([...existingDate.slots, ...selectedSlots]),
      ];
    } else {
      updatedAvailability.push({ date: selectedDate, slots: selectedSlots });
    }

    try {
      await API.put("/doctors/update-availability", {
        availability: updatedAvailability,
      });
      setAvailability(updatedAvailability);
      setToastMessage("Availability added successfully!");
      setSelectedDate("");
      setSelectedSlots([]);
    } catch (error) {
      setToastMessage("Error updating availability.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSlotFromDate = async (date, time) => {
    setIsLoading(true);
    const updatedAvailability = availability
      .map((item) =>
        item.date === date
          ? { ...item, slots: item.slots.filter((slot) => slot !== time) }
          : item
      )
      .filter((item) => item.slots.length > 0); // Remove empty dates

    try {
      await API.put("/doctors/update-availability", {
        availability: updatedAvailability,
      });
      setAvailability(updatedAvailability);
      setToastMessage("Slot removed successfully.");
    } catch (error) {
      setToastMessage("Error removing slot.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDate = async (date) => {
    setIsLoading(true);
    const updatedAvailability = availability.filter(
      (item) => item.date !== date
    );

    try {
      await API.put("/doctors/update-availability", {
        availability: updatedAvailability,
      });
      setAvailability(updatedAvailability);
      setToastMessage("Availability removed successfully.");
    } catch (error) {
      setToastMessage("Error removing availability.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader>
        <h2>Set Your Availability</h2>
        <SubTitle>Schedule your available time slots for appointments</SubTitle>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>
            <FiCalendar /> Add New Availability
          </CardTitle>
        </CardHeader>

        <FormGroup>
          <Label>
            <FiCalendar /> Select Date:
          </Label>
          <InputWrapper>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </InputWrapper>
        </FormGroup>

        <FormGroup>
          <Label>
            <FiClock /> Select Time Slots:
          </Label>
          <SlotButtons>
            {[
              "10:00 AM",
              "11:00 AM",
              "2:00 PM",
              "3:00 PM",
              "5:00 PM",
              "6:00 PM",
            ].map((time) => (
              <SlotButton
                key={time}
                selected={selectedSlots.includes(time)}
                onClick={() =>
                  selectedSlots.includes(time)
                    ? handleRemoveSlot(time)
                    : handleAddSlot(time)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {time}
                {selectedSlots.includes(time) && (
                  <CheckIcon
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FiCheck />
                  </CheckIcon>
                )}
              </SlotButton>
            ))}
          </SlotButtons>
        </FormGroup>

        <ConfirmButton
          onClick={handleConfirmAvailability}
          disabled={isLoading || !selectedDate || selectedSlots.length === 0}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiPlus /> Confirm Availability
        </ConfirmButton>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <FiClock /> Your Current Availability
          </CardTitle>
        </CardHeader>

        <AnimatePresence>
          {isLoading ? (
            <LoadingMessage>Loading your availability...</LoadingMessage>
          ) : availability.length > 0 ? (
            <AvailabilityList>
              {availability.map((slot, index) => (
                <AvailabilityItem
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <DateHeader>
                    <DateText>{formatDate(slot.date)}</DateText>
                    <RemoveDateButton
                      onClick={() => handleRemoveDate(slot.date)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiTrash2 />
                    </RemoveDateButton>
                  </DateHeader>

                  <SlotList>
                    {slot.slots.map((time, i) => (
                      <SlotItem
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                      >
                        <TimeText>{time}</TimeText>
                        <RemoveSlotButton
                          onClick={() =>
                            handleRemoveSlotFromDate(slot.date, time)
                          }
                          whileHover={{ scale: 1.1, color: "red" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiTrash2 />
                        </RemoveSlotButton>
                      </SlotItem>
                    ))}
                  </SlotList>
                </AvailabilityItem>
              ))}
            </AvailabilityList>
          ) : (
            <EmptyState>
              <EmptyText>You haven't set any availability yet.</EmptyText>
            </EmptyState>
          )}
        </AnimatePresence>
      </Card>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="info"
          onClose={() => setToastMessage("")}
        />
      )}
    </Container>
  );
};

export default DoctorAvailability;

const Container = styled(motion.div)`
  /* max-width: 900px; */
  width: 75vw;
  height: 85vh;

  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
`;

const SubTitle = styled.p`
  color: #718096;
  font-size: 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const CardHeader = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2d3748;

  svg {
    color: #4299e1;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.p`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #4299e1;
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
  }
`;

const SlotButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const SlotButton = styled(motion.button)`
  background: ${(props) =>
    props.selected ? "linear-gradient(135deg, #3182ce, #4299e1)" : "white"};
  color: ${(props) => (props.selected ? "white" : "#4a5568")};
  border: 1px solid ${(props) => (props.selected ? "#3182ce" : "#e2e8f0")};
  padding: 0.7rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(props) =>
    props.selected
      ? "0 4px 12px rgba(66, 153, 225, 0.2)"
      : "0 1px 3px rgba(0, 0, 0, 0.05)"};
`;

const CheckIcon = styled(motion.span)`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #38b2ac;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

const ConfirmButton = styled(motion.button)`
  background: linear-gradient(135deg, #3182ce, #4299e1);
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.2);

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AvailabilityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #718096;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
`;

const EmptyText = styled.p`
  font-size: 1rem;
`;

const AvailabilityItem = styled(motion.div)`
  background: linear-gradient(to right, #f7fafc, #edf2f7);
  padding: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #4299e1;
`;

const DateHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DateText = styled.strong`
  font-size: 1.1rem;
  color: #2d3748;
`;

const SlotList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const SlotItem = styled(motion.span)`
  background: white;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const TimeText = styled.span`
  font-weight: 500;
  color: #4a5568;
`;

const RemoveSlotButton = styled(motion.button)`
  background: none;
  border: none;
  cursor: pointer;
  color: #a0aec0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;

const RemoveDateButton = styled(motion.button)`
  background: rgba(245, 101, 101, 0.1);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #f56565;
`;
