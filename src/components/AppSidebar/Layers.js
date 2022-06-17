import {
  Avatar,
  Checkbox,
  Collapse,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LayersIcon from "@mui/icons-material/Layers";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ImageIcon from "@mui/icons-material/Image";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import DeselectIcon from "@mui/icons-material/Deselect";
import SelectAllIcon from "@mui/icons-material/SelectAll";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";
import { SelectionTypes } from "../../utils/types";
import { useAppContext } from "../../context/AppContext";

const LayersHeader = ({ isOpen, setIsOpen }) => {
  return (
    <ListItemButton onClick={() => setIsOpen(!isOpen)}>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary={"Layers"}></ListItemText>
      <ExpandMoreIcon
        sx={{
          transition: (theme) =>
            theme.transitions.create("transform", {
              duration: theme.transitions.duration.shortest,
            }),
          transform: !isOpen ? "rotate(0deg)" : "rotate(180deg)",
        }}
      />
    </ListItemButton>
  );
};

const DraggableListItem = ({ item, index }) => {
  const { state, actions } = useAppContext();

  const handleLockToggle = (event) => {
    event.stopPropagation();
    item.canvasObject.set({
      selectable: !event.target.checked,
      evented: !event.target.checked,
    });
    state.canvas.discardActiveObject().requestRenderAll();

    actions.updateLayers();
  };

  const handleToggleSelectLayer = (event) => {
    event.stopPropagation();
    if (!item.selected && item.canvasObject.selectable) {
      state.canvas.setActiveObject(item.canvasObject);
    } else {
      state.canvas.discardActiveObject();
    }

    state.canvas.renderAll();

    actions.updateLayers();
  };

  const handleSelectLayer = () => {
    if (!item.selected && item.canvasObject.selectable) {
      state.canvas.setActiveObject(item.canvasObject);
      state.canvas.renderAll();
    }

    actions.updateLayers();
  };

  const handleDeleteSelectLayer = (event) => {
    event.stopPropagation();
    state.canvas.remove(item.canvasObject);

    actions.updateLayers();
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <ListItemButton
          ref={provided.innerRef}
          onClick={handleSelectLayer}
          disableRipple={!item.canvasObject.selectable}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItemAvatar>
            <Avatar>
              {item.type === SelectionTypes.Text ? (
                <TextFieldsIcon />
              ) : (
                <ImageIcon />
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.primary}
            secondary={item.secondary}
            primaryTypographyProps={{
              style: {
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
            }}
          />
          <ListItemSecondaryAction>
            <IconButton size="small" onClick={handleDeleteSelectLayer}>
              <DeleteIcon />
            </IconButton>
            <Checkbox
              size="small"
              checked={item.locked}
              icon={<LockOpenIcon />}
              checkedIcon={<LockIcon />}
              onClick={handleLockToggle}
            />
            <Checkbox
              size="small"
              checked={item.selected}
              icon={<SelectAllIcon />}
              checkedIcon={<DeselectIcon />}
              onClick={handleToggleSelectLayer}
              disabled={!item.canvasObject.selectable}
            />
          </ListItemSecondaryAction>
        </ListItemButton>
      )}
    </Draggable>
  );
};

const Layers = () => {
  const [isOpen, setIsOpen] = useState(true);

  const { state, actions } = useAppContext();

  /**
   * This handler gets called when an item is dragged in the layers list.
   * The layer list is reversed from the layer list in Fabric. In fabric,
   * the top layer is the latest index. To make it more intuitive on the UI,
   * reversing the array will make the top layer on position 0. This would
   * happen in a perfect scenario, but since the gray overlay is part of the
   * layers and always on top, the top layer has position 1 after reversing.
   *
   * The handler gets the reversed positions and reverts it back to the system
   * used in Fabric js. Hence, dragging a layer from position 3 to position 0
   * out of 5 layers on the UI, will mean dragging from position 2 to position 5
   * in Fabric.
   *
   * @param {any} event Event that comes from the drag and drop library.
   */
  const handleDragEnd = (event) => {
    const sourceIndex = event.source.index;
    const destinationIndex = event.destination.index;
    const canvasObjects = state.canvas.getObjects();

    const arrayOffset = 1; // the offset is 1 position because we have the gray overlay always on top
    const canvasObjectsLastIndex = canvasObjects.length - 1 - arrayOffset; //not calculating the greyOverlay always on 0 position for inverted array

    const reversedSourceIndex = canvasObjectsLastIndex - sourceIndex; // Reversed back in fabric js way
    const reversedDestinationIndex = canvasObjectsLastIndex - destinationIndex;

    const sourceObject = state.canvas.getObjects()[reversedSourceIndex];
    sourceObject.moveTo(reversedDestinationIndex);
    state.canvas.requestRenderAll();

    actions.updateLayers();
  };

  return (
    <Paper variant="outlined">
      <LayersHeader isOpen={isOpen} setIsOpen={setIsOpen} />
      <Collapse in={isOpen} timeout="auto">
        <List>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {state.canvasLayers.map((item, index) =>
                    item.id ? (
                      <DraggableListItem
                        item={item}
                        index={index}
                        key={item.id}
                      />
                    ) : null
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </List>
      </Collapse>
    </Paper>
  );
};

export default Layers;
