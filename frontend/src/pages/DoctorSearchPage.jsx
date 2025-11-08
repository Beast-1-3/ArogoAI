import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import DoctorCard from "../components/DoctorCard";
import { FiSearch, FiMapPin, FiBriefcase, FiX, FiChevronDown } from "react-icons/fi";

// Indian cities for location suggestions
const indianCities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai",
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Lucknow",
  "Surat", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ghaziabad",
  "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
  "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad",
  "Amritsar", "Allahabad", "Ranchi", "Coimbatore", "Jabalpur",
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur",
];

const DoctorSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const specialtyRef = useRef(null);
  const locationRef = useRef(null);
  const filterPanelRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target)) {
        setShowSpecialtyDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowLocationSuggestions(false);
      }
      if (filterPanelRef.current && !filterPanelRef.current.contains(event.target)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchRandomDoctors();
  }, []);

  // Filter location suggestions based on input
  const handleLocationChange = (value) => {
    setLocation(value);
    setActiveFilter("location");
    if (value.length > 0) {
      const filtered = indianCities.filter(city =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setLocationSuggestions(filtered.slice(0, 5));
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const selectLocation = (city) => {
    setLocation(city);
    setShowLocationSuggestions(false);
    setActiveFilter("location");
  };

  const fetchRandomDoctors = async () => {
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors`);
      setDoctors(data.data);
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorsByName = async () => {
    if (!searchQuery) return;
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors/search`, {
        params: { name: searchQuery },
      });
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
    setShowDropdown(false);
  };

  const fetchDoctorsBySpecialty = async () => {
    if (!specialty) return;
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors/search`, {
        params: { specialty },
      });
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorsByLocation = async () => {
    if (!location) return;
    setIsLoading(true);
    try {
      const { data } = await API.get(`/doctors/search`, {
        params: { city: location },
      });
      setFilteredDoctors(data.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchDoctorsByName();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    fetchRandomDoctors();
  };

  const specialties = [
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "General Physician",
    "ENT Specialist",
  ];

  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader>
        <SearchTitle>Find Your Doctor</SearchTitle>
        <SearchDescription>
          Search for doctors by name, specialty, or location
        </SearchDescription>
      </PageHeader>

      <SearchSection>
        <MainSearchContainer>
          <SearchInputWrapper>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <MainSearchInput
              type="text"
              placeholder="Search by doctor name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(e.target.value.length > 0);
              }}
              onKeyPress={handleKeyPress}
            />
            {searchQuery && (
              <ClearButton
                onClick={clearSearch}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX />
              </ClearButton>
            )}
          </SearchInputWrapper>

          <SearchButtonStyled
            onClick={fetchDoctorsByName}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <FiSearch size={16} />
            <span>Search</span>
          </SearchButtonStyled>

          <AnimatePresence>
            {showDropdown && searchQuery.length > 0 && (
              <DropdownContainer
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {doctors
                  .filter((doctor) =>
                    doctor.user.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((doctor) => (
                    <DropdownItem
                      key={doctor._id}
                      onClick={() => {
                        setSearchQuery(doctor.user.name);
                        setFilteredDoctors([doctor]);
                        setShowDropdown(false);
                      }}
                      whileHover={{ backgroundColor: "#f8f9fa" }}
                    >
                      <strong>{doctor.user.name}</strong>
                      <DropdownDetails>
                        <SpecialtyBadge>{doctor.specialty}</SpecialtyBadge>
                      </DropdownDetails>
                    </DropdownItem>
                  ))}
                {doctors.filter((doctor) =>
                  doctor.user.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                ).length === 0 && (
                    <NoResultsItem>No matching doctors found</NoResultsItem>
                  )}
              </DropdownContainer>
            )}
          </AnimatePresence>
        </MainSearchContainer>

        {/* Filter Button and Panel */}
        <FilterButtonWrapper ref={filterPanelRef}>
          <FilterToggleButton
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            active={specialty || location}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FiBriefcase size={16} />
            <span>Filters</span>
            {(specialty || location) && <ActiveDot />}
          </FilterToggleButton>

          <AnimatePresence>
            {showFilterPanel && (
              <FilterPanel
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <FilterPanelSection ref={specialtyRef}>
                  <FilterPanelLabel>
                    <FiBriefcase size={14} />
                    Specialty
                  </FilterPanelLabel>
                  <DropdownWrapper>
                    <DropdownSelect
                      onClick={() => setShowSpecialtyDropdown(!showSpecialtyDropdown)}
                    >
                      <span>{specialty || "All Specialties"}</span>
                      <FiChevronDown
                        style={{
                          transform: showSpecialtyDropdown ? "rotate(180deg)" : "rotate(0)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </DropdownSelect>
                    <AnimatePresence>
                      {showSpecialtyDropdown && (
                        <DropdownOptions
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <DropdownOption
                            onClick={() => {
                              setSpecialty("");
                              setShowSpecialtyDropdown(false);
                            }}
                          >
                            All Specialties
                          </DropdownOption>
                          {specialties.map((spec) => (
                            <DropdownOption
                              key={spec}
                              selected={specialty === spec}
                              onClick={() => {
                                setSpecialty(spec);
                                setShowSpecialtyDropdown(false);
                              }}
                            >
                              {spec}
                            </DropdownOption>
                          ))}
                        </DropdownOptions>
                      )}
                    </AnimatePresence>
                  </DropdownWrapper>
                </FilterPanelSection>

                <FilterPanelSection ref={locationRef}>
                  <FilterPanelLabel>
                    <FiMapPin size={14} />
                    Location
                  </FilterPanelLabel>
                  <LocationWrapper>
                    <LocationInput
                      type="text"
                      placeholder="Enter city name"
                      value={location}
                      onChange={(e) => handleLocationChange(e.target.value)}
                    />
                    {location && (
                      <ClearLocationButton onClick={() => setLocation("")}>
                        <FiX size={14} />
                      </ClearLocationButton>
                    )}
                    <AnimatePresence>
                      {showLocationSuggestions && locationSuggestions.length > 0 && (
                        <LocationSuggestions
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {locationSuggestions.map((city) => (
                            <SuggestionItem
                              key={city}
                              onClick={() => selectLocation(city)}
                            >
                              <FiMapPin size={12} />
                              {city}
                            </SuggestionItem>
                          ))}
                        </LocationSuggestions>
                      )}
                    </AnimatePresence>
                  </LocationWrapper>
                </FilterPanelSection>

                <ApplyFiltersButton
                  onClick={() => {
                    if (specialty) fetchDoctorsBySpecialty();
                    else if (location) fetchDoctorsByLocation();
                    setShowFilterPanel(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!specialty && !location}
                >
                  Apply Filters
                </ApplyFiltersButton>
              </FilterPanel>
            )}
          </AnimatePresence>
        </FilterButtonWrapper>
      </SearchSection>

      <ResultsContainer>
        <ResultsHeader>
          <ResultsCount>{filteredDoctors.length} doctors found</ResultsCount>
        </ResultsHeader>

        {isLoading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Searching for doctors...</LoadingText>
          </LoadingContainer>
        ) : (
          <DoctorGrid
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))
            ) : (
              <NoResultsContainer>
                <NoResultsIcon>🔍</NoResultsIcon>
                <NoResultsText>
                  No doctors found matching your criteria.
                </NoResultsText>
                <ResetSearchButton
                  onClick={fetchRandomDoctors}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Reset Search
                </ResetSearchButton>
              </NoResultsContainer>
            )}
          </DoctorGrid>
        )}
      </ResultsContainer>
    </PageContainer>
  );
};

export default DoctorSearchPage;

const PageContainer = styled(motion.div)`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const SearchTitle = styled.h2`
  font-size: 2.75rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #0077b6, #00b4d8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const SearchDescription = styled.p`
  font-size: 1.15rem;
  color: #64748b;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SearchSection = styled.div`
  margin-bottom: 2.5rem;
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 119, 182, 0.08);
  padding: 2rem;
  border: 1px solid rgba(0, 180, 216, 0.15);
`;

const MainSearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  background: #f8f9fa;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: #0096c7;
    box-shadow: 0 0 0 4px rgba(0, 150, 199, 0.15);
    background: white;
  }
`;

const SearchIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  padding: 0 0.75rem;
`;

const MainSearchInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 0.9rem 0.75rem;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #212529;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ClearButton = styled(motion.button)`
  background: none;
  border: none;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const SearchButtonStyled = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #0077b6, #0096c7);
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 119, 182, 0.2);

  @media (max-width: 768px) {
    margin-top: 0.75rem;
  }
`;

const DropdownContainer = styled(motion.div)`
  position: absolute;
  width: calc(100% - 9rem);
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 20;
  overflow: hidden;
  border: 1px solid #e9ecef;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DropdownItem = styled(motion.div)`
  padding: 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f1f3f5;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DropdownDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
`;

const SpecialtyBadge = styled.span`
  background: #e9f7fc;
  color: #0096c7;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const NoResultsItem = styled.div`
  padding: 1rem;
  color: #6c757d;
  text-align: center;
  font-style: italic;
`;

const FilterButtonWrapper = styled.div`
  position: relative;
  margin-top: 1rem;
`;

const FilterToggleButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 100px;
  border: 1px solid ${(props) => (props.active ? "#0077b6" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#f0f9ff" : "white")};
  color: ${(props) => (props.active ? "#0077b6" : "#475569")};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: #0077b6;
    background: #f0f9ff;
  }
`;

const ActiveDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0077b6;
`;

const FilterPanel = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.75rem);
  left: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 50px rgba(0, 0, 0, 0.12);
  padding: 1.5rem;
  z-index: 40;
  min-width: 320px;
  border: 1px solid #e2e8f0;
`;

const FilterPanelSection = styled.div`
  margin-bottom: 1.25rem;

  &:last-of-type {
    margin-bottom: 1rem;
  }
`;

const FilterPanelLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;

  svg {
    color: #0077b6;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterSection = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
`;

const FilterIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0077b6;
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const DropdownSelect = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 100px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e293b;
  min-width: 160px;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  span {
    flex: 1;
  }
`;

const DropdownOptions = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  z-index: 30;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  max-height: 280px;
  overflow-y: auto;
`;

const DropdownOption = styled.div`
  padding: 0.85rem 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: ${(props) => (props.selected ? "#0077b6" : "#475569")};
  background: ${(props) => (props.selected ? "#f0f9ff" : "white")};
  font-weight: ${(props) => (props.selected ? "600" : "400")};
  transition: all 0.15s ease;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f9ff;
    color: #0077b6;
  }
`;

const LocationWrapper = styled.div`
  position: relative;
`;

const ClearLocationButton = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #475569;
  }
`;

const LocationSuggestions = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  z-index: 30;
  overflow: hidden;
  border: 1px solid #e2e8f0;
`;

const SuggestionItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #475569;
  transition: all 0.15s ease;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }

  svg {
    color: #0096c7;
  }
`;

const SpecialtyFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SpecialtyChip = styled(motion.button)`
  background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, #0077b6, #00b4d8)"
      : "#f1f5f9"};
  color: ${(props) => (props.selected ? "white" : "#475569")};
  border: 1px solid ${(props) => (props.selected ? "transparent" : "#e2e8f0")};
  padding: 0.6rem 1.25rem;
  border-radius: 100px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;
  font-weight: ${(props) => (props.selected ? "600" : "500")};
  box-shadow: ${(props) =>
    props.selected ? "0 4px 12px rgba(0, 119, 182, 0.3)" : "none"};

  &:hover {
    background: ${(props) =>
    props.selected
      ? "linear-gradient(135deg, #0077b6, #00b4d8)"
      : "#e2e8f0"};
    transform: translateY(-1px);
  }
`;

const LocationInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const LocationInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  font-size: 0.95rem;
  background: #f8f9fa;
  transition: all 0.2s ease;
  color: #000;

  &:focus {
    outline: none;
    border-color: #0096c7;
    box-shadow: 0 0 0 3px rgba(0, 150, 199, 0.15);
    background: white;
  }
`;

const LocationSearchButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f3f5;
  color: #495057;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ApplyFiltersButton = styled(motion.button)`
  background: ${(props) =>
    props.disabled ? "#f1f3f5" : "linear-gradient(to right, #0077b6, #0096c7)"};
  color: ${(props) => (props.disabled ? "#adb5bd" : "white")};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  box-shadow: ${(props) =>
    props.disabled ? "none" : "0 4px 10px rgba(0, 119, 182, 0.2)"};
  align-self: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 1rem;
  }
`;

const ResultsContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  border: 1px solid rgba(0, 119, 182, 0.1);
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f3f5;
`;

const ResultsCount = styled.div`
  font-weight: 600;
  color: #495057;
`;

const DoctorGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #f1f3f5;
  border-radius: 50%;
  border-top-color: #0096c7;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: #6c757d;
  font-size: 1rem;
`;

const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  grid-column: 1 / -1;
  text-align: center;
`;

const NoResultsIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const NoResultsText = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
`;

const ResetSearchButton = styled(motion.button)`
  background: #f1f3f5;
  color: #495057;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;
