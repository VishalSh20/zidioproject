import { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";
import Form from "./Form/Form";
import './MainPage.css';
import SectionSelect from "./Form/SectionSelect";
import sections from "./Form/sectionData";
import ResumeViewer from "./ResumePdf/ResumePdf";
import useFormStore from "../store";
import LivePreview from "./ResumePdf/LivePreview";

function MainPage() {
  const [ sectionArrays, setSectionArrays ] = useFormStore((state) => [
    state.sections, state.setSections
  ]);
  const [ currentIndex, setCurrentIndex ] = useState(0);
  const [ editMode, setEditMode ] = useState(0);  // 0 - full page, 1 - side-by-side
  const [ showSelectOverlay, setShowOverlay ] = useState(false);


  const handleSectionAdd = (sectionKey) => {
    const newAvailable = sectionArrays.available.filter(item => item !== sectionKey)
    const newAdded = [...sectionArrays.added, sectionKey];
    setSectionArrays({
      available: newAvailable,
      added: newAdded,
    });
    setShowOverlay(false);
    setCurrentIndex(currentIndex + 1);
  }

  const handleShowOverlay = () => {
    setShowOverlay(true);
  }

  const handleCloseOverlay = (e) => {
    const isOverlay = e.target.classList.contains('select-overlay');
    const isCloseBtn = e.target.classList.contains('select-close-btn');
    if (!(isCloseBtn || isOverlay)) return;
    setShowOverlay(false);
  }

  const showNextSection = () => {
    const { available, added } = sectionArrays;
    if (available.length && currentIndex === added.length - 1) {
      handleShowOverlay();
    } else {
      setCurrentIndex(currentIndex + 1);
    };
  }

  const showPrevSection = () => {
    setCurrentIndex(currentIndex - 1);
  }

  const goToSection = (index) => {
    setCurrentIndex(index);
  }

  const sortAvailable = () => {
    const newAvailable = [...sectionArrays.available];
    newAvailable.sort((a, b) => sections[a].id - sections[b].id);
    setSectionArrays({
      ...sectionArrays,
      available: newAvailable,
    })
  }

  const sortAdded = () => {
    const newAdded = [...sectionArrays.added];
    newAdded.sort((a, b) => (sections[a].id - sections[b].id));
    setSectionArrays({
      ...sectionArrays,
      added: newAdded,
    })
  }

  const toggleEditMode = () => {
    const newMode = editMode === 0 ? 1 : 0;
    setEditMode(newMode);
  }


  return (
    <div className={editMode === 1 ? 'main-container dual-mode' : 'main-container'}>
      <Sidebar goToSection={goToSection} toggleSideBySide={toggleEditMode}/>
      <Form currentIndex={currentIndex} showNextSection={showNextSection} showPrevSection={showPrevSection} />
      {editMode === 1 ? <LivePreview /> : null}
      { showSelectOverlay && <SectionSelect handleSectionAdd={handleSectionAdd}
        handleCloseOverlay={handleCloseOverlay} /> }
    </div>
  )
}

export default MainPage;