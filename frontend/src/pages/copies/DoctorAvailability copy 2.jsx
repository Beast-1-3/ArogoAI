/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import API from "../../services/api";
import AuthContext from "../../context/AuthContext";
import Toast from "../../components/Toast";
import { FiTrash2 } from "react-icons/fi";

const DoctorAvailability = () => {
  const { user } = useContext(AuthContext);
  const [availability, setAvailability] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const { data } = await API.get("/auth/me"); // Get doctor details
      setAvailability(data.data.availability || []);
    } catch (error) {
      console.error("Error fetching availability", error);
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
    }
  };

  const handleRemoveSlotFromDate = async (date, time) => {
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
    }
  };

  const handleRemoveDate = async (date) => {
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
    }
  };

  return (
    <Container>
      <h2>Set Your Availability</h2>

      {/* Date Picker */}
      <Label>Select Date:</Label>
      <Input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* Time Slot Selector */}
      <Label>Select Time Slots:</Label>
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
          >
            {time}
          </SlotButton>
        ))}
      </SlotButtons>

      {/* Confirm Button */}
      <ConfirmButton onClick={handleConfirmAvailability}>
        Confirm Availability
      </ConfirmButton>

      {/* Existing Availability Display */}
      <AvailabilityList>
        <h3>Your Current Availability</h3>
        {availability.length > 0 ? (
          availability.map((slot, index) => (
            <AvailabilityItem key={index}>
              <strong>{slot.date}:</strong>
              <SlotList>
                {slot.slots.map((time, i) => (
                  <SlotItem key={i}>
                    {time}
                    <RemoveSlotButton
                      onClick={() => handleRemoveSlotFromDate(slot.date, time)}
                    >
                      <FiTrash2 />
                    </RemoveSlotButton>
                  </SlotItem>
                ))}
              </SlotList>
              <RemoveDateButton onClick={() => handleRemoveDate(slot.date)}>
                Remove Date
              </RemoveDateButton>
            </AvailabilityItem>
          ))
        ) : (
          <p>No availability set.</p>
        )}
      </AvailabilityList>

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

const Container = styled.div`
  padding: 2rem;
`;

const Label = styled.p`
  font-weight: bold;
  margin-top: 1rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
`;

const SlotButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SlotButton = styled.button`
  background: ${(props) => (props.selected ? "#0077b6" : "#e3f2fd")};
  color: ${(props) => (props.selected ? "white" : "#0077b6")};
  border: 1px solid #0077b6;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: ${(props) => (props.selected ? "#005f8f" : "#bde0fe")};
  }
`;

const ConfirmButton = styled.button`
  background: #0077b6;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #005f8f;
  }
`;

const AvailabilityList = styled.div`
  margin-top: 2rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
`;

const AvailabilityItem = styled.div`
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 6px;
  margin: 0.5rem 0;
`;

const SlotList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SlotItem = styled.span`
  background: white;
  padding: 0.5rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveSlotButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: red;
`;

const RemoveDateButton = styled.button`
  background: red;
  color: white;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 0.5rem;
`;
