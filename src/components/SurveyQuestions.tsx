// Core Imports
import React, { useState, useRef, useEffect } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Slide,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Button,
  Container,
  TextField,
  LinearProgress,
  createStyles,
  withStyles,
  Theme,
  AppBar,
  Icon,
  IconButton,
  Toolbar,
  Grid,
  Slider,
  Menu,
  MenuItem,
  ListItemText,
  ListItem,
  List,
} from "@material-ui/core"
import classnames from "classnames"
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import { spliceActivity } from "./ActivityList"

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 5,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: "#92E7CA",
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#2F9D7E",
    },
  })
)(LinearProgress)

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  sliderActionsContainer: {
    position: "absolute",
    textAlign: "center",
    width: "100%",
    left: 0,
    marginBottom: 15,
    [theme.breakpoints.down("xs")]: {
      bottom: "5%",
    },
  },
  radioroot: {
    padding: "23px",
  },
  icon: {
    borderRadius: "50%",
    width: 32,
    height: 32,
    border: "#C6C6C6 solid 2px",
    backgroundColor: "#fff",
    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$root.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  checkedIcon: {
    backgroundColor: "#2F9D7E",
    borderColor: "#2F9D7E",
    backgroundImage: "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 32,
      height: 32,
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#2F9D7E",
    },
  },
  btngreen: {
    background: "#92E7CA",
    borderRadius: "40px",
    minWidth: "150px",
    boxShadow: "0px 10px 15px rgba(146, 231, 202, 0.25)",
    lineHeight: "38px",
    margin: "5% 5px 0 5px",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    [theme.breakpoints.up("md")]: {
      marginTop: 30,
    },
    "&:hover": { background: "#92E7CA" },
  },
  toolbar: {
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    "& h5": {
      color: "#555555",
      fontSize: 25,
      fontWeight: "bold",
      position: "absolute",
      bottom: 0,
    },
  },
  toolbardashboard: {
    minHeight: 65,
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
    },
  },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  slider: { width: "80%", color: "#2F9D7E" },
  sliderRail: {
    background: "#BCEFDD",
    borderRadius: "2px",
  },
  btnBack: {
    borderRadius: "40px",
    minWidth: "150px",
    boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.05)",
    lineHeight: "38px",
    fontFamily: "inter",
    textTransform: "capitalize",
    fontSize: "16px",
    cursor: "pointer",
    margin: "5% 5px 0 5px",
    [theme.breakpoints.up("md")]: {
      marginTop: 30,
    },
  },
  minutes: {
    padding: "10px",
  },
  hours: {
    padding: "10px",
  },
  ampm: {
    padding: "10px",
  },
  timeSelect: { minWidth: 55, margin: "0 10px", "& svg": { display: "none" } },
  timeselectInput: { margin: 0, padding: "10px 0 !important", fontSize: 40 },
  questionTrack: {
    fontSize: "14px",
    color: "#2F9D7E",
    fontWeight: "normal",
    margin: "-10px 0 50px 0",
  },
  radioGroup: {
    marginTop: "30px",
    marginLeft: -15,
    [theme.breakpoints.up("md")]: {
      marginTop: 0,
    },
  },
  textAreaControl: {
    width: "100%",
    marginTop: 35,
    background: "#f5f5f5",
    borderRadius: 10,
    "& p": { position: "absolute", bottom: 15, right: 0 },
  },
  textArea: {
    borderRadius: "10px",
    "& fieldset": { borderWidth: 0 },
  },
  sliderResponse: {
    marginTop: "60px",
    "& h4": {
      color: "#22977B",
      fontSize: 25,
      fontWeight: 600,
    },
  },
  surveyquestions: {
    padding: 10,
    "& h5": { fontSize: 18 },
  },
  questionhead: {
    "& h5": { fontSize: 18, fontWeight: 600 },
    "& span": {
      marginTop: 15,
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.5)",
    },
  },
  timeHours: {
    padding: 0,
    borderBottom: "#BCEFDD solid 2px",
    minWidth: 57,
    "& div": { padding: 0, margin: 0 },
    "& p": { fontSize: 40, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)", textAlign: "center" },
  },
  textCaption: { color: "rgba(0, 0, 0, 0.5)", fontSize: 10 },
  centerBar: { height: 4, background: "#BCEFDD" },
  customTrack: { width: 4, height: 4, borderRadius: "50%", background: "#65DEB4" },
  customThumb: { width: 24, height: 24, marginTop: -10, marginLeft: -10 },
  menuPaper: {
    background: "#F5F5F5",
    boxShadow: "none",
    marginTop: 54,
    maxHeight: 300,
    minWidth: 57,
    borderRadius: 0,
    "& ul": { padding: 0 },
    "& li": {
      fontSize: 25,
      maxWidth: 57,
      padding: "0 12px",
    },
  },
  timeWrapper: {
    fontSize: 25,
    marginTop: 50,
    [theme.breakpoints.up("md")]: {
      justifyContent: "left",
    },
  },
  textfieldwrapper: { marginLeft: -12, marginRight: -12 },
  listSelected: {
    background: "#E7F8F2 !important",
  },
}))

// Splice together all selected activities & their tags.
async function getSplicedSurveys(activities) {
  let res = await Promise.all(activities.map((x) => LAMP.Type.getAttachment(x.id, "lamp.dashboard.survey_description")))
  let spliced = res.map((y: any, idx) =>
    spliceActivity({
      raw: activities[idx],
      tag: !!y.error ? undefined : y.data,
    })
  )
  // Short-circuit the main title & description if there's only one survey.
  const main = {
    name: spliced.length === 1 ? spliced[0].name : "Multi-questionnaire",
    description: spliced.length === 1 ? spliced[0].description : "Please complete all sections below. Thank you.",
  }
  if (spliced.length === 1) spliced[0].name = spliced[0].description = undefined
  return {
    name: main.name,
    description: main.description,
    sections: spliced,
  }
}

function range(start, stop, step = 1) {
  return [...Array(stop - start).keys()].map((v, i) =>
    start + i * step < 10 ? "0" + (start + i * step) : start + i * step
  )
}
function _patientMode() {
  return LAMP.Auth._type === "participant"
}

function _useTernaryBool() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}

function RadioOption({ onChange, options, value, ...props }) {
  const [selectedValue, setSelectedValue] = useState(value || "")

  const classes = useStyles()
  return (
    <FormControl component="fieldset" className={classes.radioGroup}>
      <RadioGroup
        {...props}
        name="option"
        value={selectedValue}
        onChange={(event) => {
          setSelectedValue(event.target.value)
          onChange(event.target.value)
        }}
      >
        {options.map((x) => (
          <FormControlLabel
            key={x.label}
            value={`${x.value}`}
            style={{ alignItems: !!x.description ? "flex-start" : undefined }}
            control={
              <Radio
                className={classes.radioroot}
                disableRipple
                color="default"
                size="medium"
                onClick={() => {
                  if (selectedValue === `${x.value}`) {
                    setSelectedValue("")
                    onChange(undefined)
                  }
                }}
                checkedIcon={<span className={classnames(classes.icon, classes.checkedIcon)} />}
                icon={<span className={classes.icon} />}
              />
            }
            label={
              <Typography component="span" variant="body2">
                {x.label}
                {!!x.description && (
                  <Box
                    my={0.5}
                    p={0.5}
                    borderRadius={4}
                    borderColor="text.secondary"
                    border={1}
                    color="text.secondary"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {x.description}
                  </Box>
                )}
              </Typography>
            }
            labelPlacement="end"
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}

function TimeSelection({ onChange, value, ...props }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null)
  const [anchorE3, setAnchorE3] = React.useState<null | HTMLElement>(null)
  const [hourSelectedIndex, setHourSelectedIndex] = React.useState("01")
  const [minuteSelectedIndex, setMinuteSelectedIndex] = React.useState("00")
  const [ampmSelectedIndex, setAmPmSelectedIndex] = React.useState("am")

  const handleClickHours = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClickMinutes = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget)
  }

  const handleClickAmPm = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE3(event.currentTarget)
  }

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: any, type: number) => {
    switch (type) {
      case 0:
        setHourSelectedIndex(index)
        setAnchorEl(null)
        break
      case 1:
        setMinuteSelectedIndex(index)
        setAnchorE2(null)
        break
      case 2:
        setAmPmSelectedIndex(index)
        setAnchorE3(null)
        break
    }
  }
  const handleHoursClose = () => {
    setAnchorEl(null)
  }
  const handleMinutesClose = () => {
    setAnchorE2(null)
  }
  const handleAmPmClose = () => {
    setAnchorE3(null)
  }
  const ampm = []

  let hourvalues = range(1, 13)
  let minutevalues = range(0, 4, 15)

  ampm.push(
    <MenuItem
      key="am"
      selected={"am" === ampmSelectedIndex}
      onClick={(event) => handleMenuItemClick(event, "am", 2)}
      classes={{ selected: classes.listSelected }}
    >
      am
    </MenuItem>
  )
  ampm.push(
    <MenuItem
      key="pm"
      selected={"pm" === ampmSelectedIndex}
      onClick={(event) => handleMenuItemClick(event, "pm", 2)}
      classes={{ selected: classes.listSelected }}
    >
      pm
    </MenuItem>
  )

  return (
    <Box textAlign="center">
      <Grid container justify="center" alignItems="center" spacing={2} className={classes.timeWrapper}>
        <Grid item>
          <List component="nav" className={classes.timeHours}>
            <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickHours}>
              <ListItemText secondary={hourSelectedIndex} />
            </ListItem>
          </List>
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleHoursClose}
            classes={{ paper: classes.menuPaper }}
          >
            {hourvalues.map((option, index) => (
              <MenuItem
                key={option}
                selected={option === hourSelectedIndex}
                onClick={(event) => handleMenuItemClick(event, option, 0)}
                classes={{ selected: classes.listSelected }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
        :
        <Grid item>
          <List component="nav" className={classes.timeHours} aria-label="Device settings">
            <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickMinutes}>
              <ListItemText secondary={minuteSelectedIndex} />
            </ListItem>
          </List>
          <Menu
            id="lock-menu"
            anchorEl={anchorE2}
            keepMounted
            open={Boolean(anchorE2)}
            onClose={handleMinutesClose}
            classes={{ paper: classes.menuPaper }}
          >
            {minutevalues.map((option, index) => (
              <MenuItem
                key={option}
                selected={option === minuteSelectedIndex}
                onClick={(event) => handleMenuItemClick(event, option, 1)}
                classes={{ selected: classes.listSelected }}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
        <Grid item>
          <List component="nav" className={classes.timeHours} aria-label="Device settings">
            <ListItem button aria-haspopup="true" aria-controls="lock-menu" onClick={handleClickAmPm}>
              <ListItemText secondary={ampmSelectedIndex} />
            </ListItem>
          </List>
          <Menu
            id="lock-menu"
            classes={{ paper: classes.menuPaper }}
            anchorEl={anchorE3}
            keepMounted
            open={Boolean(anchorE3)}
            onClose={handleAmPmClose}
          >
            {ampm}
          </Menu>
        </Grid>
      </Grid>
    </Box>
  )
}

function TextSection({ onChange, charLimit, value, ...props }) {
  const classes = useStyles()

  return (
    <Box className={classes.textfieldwrapper}>
      <FormControl
        component="fieldset"
        classes={{
          root: classes.textAreaControl,
        }}
      >
        <TextField
          id="standard-multiline-flexible"
          multiline
          rows={10}
          variant="outlined"
          onChange={onChange}
          value={!!value ? value.value : undefined}
          helperText={`${value.value.length}/${charLimit} max characters`}
          inputProps={{
            maxLength: charLimit,
          }}
          classes={{ root: classes.textArea }}
        />
      </FormControl>
    </Box>
  )
}

function Rating({ onChange, options, value, ...props }) {
  const classes = useStyles()

  const valuetext = (value: number) => {
    return `${options[value]}`
  }

  const getSliderValue = () => {
    let sliderValue = options[0].label
    let slValue = !!value ? value.value : undefined

    options.map(function (mark) {
      if (mark.value == slValue) {
        sliderValue = mark.label
      }
    })
    return sliderValue
  }

  return (
    <Box textAlign="center" mt={5}>
      <Slider
        defaultValue={!!value ? value.value : undefined}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider"
        valueLabelDisplay="auto"
        step={10}
        marks
        min={0}
        max={100}
        track={false}
        classes={{
          root: classes.slider,
          rail: classes.centerBar,
          mark: classes.customTrack,
          thumb: classes.customThumb,
        }}
        onChange={onChange}
      />
      <Grid container spacing={10} style={{ marginTop: "-50px" }} direction="row" justify="center" alignItems="center">
        <Grid item xs={4}>
          <Typography variant="caption" className={classes.textCaption} display="block" gutterBottom>
            terrible
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="caption" className={classes.textCaption} display="block" gutterBottom>
            neutral
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="caption" className={classes.textCaption} display="block" gutterBottom>
            excellent
          </Typography>
        </Grid>
      </Grid>
      <Box className={classes.sliderResponse}>
        <Typography variant="caption" display="block" gutterBottom>
          Your response:
        </Typography>
        <Typography variant="h4">{getSliderValue()}</Typography>
      </Box>
    </Box>
  )
}
function Question({ onResponse, number, text, type, options, value, ...props }) {
  let onChange = (value) => onResponse({ item: text, value: value })
  const _binaryOpts = [
    { label: "Yes", value: "Yes" /* true */ },
    { label: "No", value: "No" /* false */ },
  ]
  const _ternaryOpts = [
    { label: "Yes", value: "Yes" /* true */ },
    { label: "No", value: "No" /* false */ },
    { label: "N/A", value: null /* null */ },
  ]
  // eslint-disable-next-line
  const _boolOpts = _useTernaryBool() ? _ternaryOpts : _binaryOpts // FIXME DEPRECATED
  const classes = useStyles()
  // FIXME: CheckboxResponse, SwitchResponse
  const CHARACTER_LIMIT = 300
  let component = <Box />
  const _likertOpts = [
    { label: "Nearly All the Time", value: 3 },
    { label: "More than Half the Time", value: 2 },
    { label: "Several Times", value: 1 },
    { label: "Not at all", value: 0 },
  ]
  const _ratingOpts = [
    {
      value: 0,
      label: "Terrible",
    },

    {
      value: 10,
      label: "Very Poor",
    },
    {
      value: 20,
      label: "Very Poor",
    },
    {
      value: 30,
      label: "Poor",
    },
    {
      value: 40,
      label: "Poor",
    },

    {
      value: 50,
      label: "Neutral",
    },
    {
      value: 60,
      label: "Satisfactory",
    },
    {
      value: 70,
      label: "Good",
    },

    {
      value: 80,
      label: "Pretty Good",
    },
    {
      value: 90,
      label: "Great",
    },
    {
      value: 100,
      label: "Exellent",
    },
  ]

  switch (type) {
    case "rating":
      component = <Rating options={_ratingOpts} onChange={onChange} value={!!value ? value.value : undefined} />
      break
    case "likert":
    case "boolean":
    case "select":
    case "list":
      const selectOptions = type === "boolean" ? _binaryOpts : type === "likert" ? _likertOpts : options
      component = <RadioOption options={selectOptions} onChange={onChange} value={!!value ? value.value : undefined} />
      break
    case "text":
      component = (
        <TextSection onChange={onChange} charLimit={CHARACTER_LIMIT} value={!!value ? value.value : undefined} />
      )
      break
    case "time":
      component = <TimeSelection onChange={onChange} value={!!value ? value.value : undefined} />
      break
  }

  return (
    <Grid item xs={12} lg={6}>
      <Box className={classes.questionhead}>
        <Typography variant="h5">{text}</Typography>
        <Typography variant="caption" display="block" gutterBottom></Typography>
      </Box>
      {component}
    </Grid>
  )
}

function Section({ onResponse, value, type, prefillData, onComplete, closeDialog, ...props }) {
  const base = value.settings.map((x) => ({ item: x.text, value: null }))
  const responses = useRef(!!prefillData ? Object.assign(base, prefillData) : base)
  const [activeStep, setActiveStep] = useState(0)
  const classes = useStyles()
  const [tab, _setTab] = useState(0)
  const [scrollValue, setScrollValue] = useState(0)
  const [progressValue, setProgressValue] = useState(100 / value.settings.length)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  // Force creation of result data whether survey was interacted with or not.
  useEffect(() => {
    window.addEventListener("scroll", handleChange, true)
    onResponse(Array.from({ ...responses.current, length: value.settings.length }))
  }, [])
  const isComplete = (idx) => !!responses.current[idx]?.value
  const isError = (idx) => !isComplete(idx) && idx < activeStep

  const handleBack = () => {
    _setTab(tab - 1)
    setProgressValue(progressValue - 100 / value.settings.length)
  }
  const handleNext = () => {
    _setTab(tab + 1)
    setProgressValue(progressValue + 100 / value.settings.length)
  }
  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  const handleChange = (event) => {
    const target = event.target
    const newscrollVal = target.scrollHeight - target.scrollTop
    setScrollValue(newscrollVal)
    const newValue =
      newscrollVal > scrollValue
        ? progressValue - 100 / value.settings.length
        : progressValue + 100 / value.settings.length
    setProgressValue(newValue)
    // window.addEventListener('scroll', handleChange, true);
    console.log("sd", newValue, newscrollVal)
  }
  return (
    <Box>
      <AppBar position="fixed" style={{ background: "#E7F8F2", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton
            color="default"
            className={classes.backbtn}
            aria-label="Menu"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
            }}
            onClick={closeDialog}
          >
            <Icon>arrow_back</Icon>
          </IconButton>

          <Typography
            variant="h5"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
              color: "rgba(0, 0, 0, 0.75)",
              textAlign: "center",
              width: "100%",
            }}
          >
            {type.replace(/_/g, " ")}
          </Typography>
        </Toolbar>
        <BorderLinearProgress variant="determinate" value={progressValue} />
      </AppBar>
      {supportsSidebar
        ? value.settings.map((x, idx) => (
            <Box my={4} onScroll={handleChange}>
              <Box textAlign="center">
                <Typography gutterBottom align="center" classes={{ root: classes.questionTrack }}>
                  Question {idx + 1} of {value.settings.length}
                </Typography>
              </Box>

              <Container>
                <Question
                  number={idx + 1}
                  text={x.text}
                  type={x.type}
                  options={x.options?.map((y) => ({ ...y, label: y.value }))}
                  value={responses.current[idx]}
                  onResponse={(response) => {
                    responses.current[idx] = response

                    if (x.type !== "multiselect") setActiveStep((prev) => prev + 1)

                    onResponse(
                      Array.from({
                        ...responses.current,
                        length: value.settings.length,
                      })
                    )
                  }}
                />
                <div className={classes.sliderActionsContainer}>
                  {idx === value.settings.length - 1 && (
                    <Button
                      variant="contained"
                      onClick={idx === value.settings.length - 1 ? onComplete : handleNext}
                      className={classes.btngreen}
                    >
                      "Submit"
                    </Button>
                  )}
                </div>
              </Container>
            </Box>
          ))
        : value.settings.map((x, idx) => (
            <Slide in={tab === idx} direction={tabDirection(idx)} mountOnEnter unmountOnExit>
              <Box my={4}>
                <Box textAlign="center">
                  <Typography gutterBottom align="center" classes={{ root: classes.questionTrack }}>
                    Question {idx + 1} of {value.settings.length}
                  </Typography>
                </Box>

                <Container>
                  <Question
                    number={idx + 1}
                    text={x.text}
                    type={x.type}
                    options={x.options?.map((y) => ({ ...y, label: y.value }))}
                    value={responses.current[idx]}
                    onResponse={(response) => {
                      responses.current[idx] = response

                      if (x.type !== "multiselect") setActiveStep((prev) => prev + 1)

                      onResponse(
                        Array.from({
                          ...responses.current,
                          length: value.settings.length,
                        })
                      )
                    }}
                  />
                  <div className={classes.sliderActionsContainer}>
                    {idx > 0 && (
                      <Button onClick={handleBack} className={classes.btnBack}>
                        Back
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      onClick={idx === value.settings.length - 1 ? onComplete : handleNext}
                      className={classes.btngreen}
                    >
                      {idx === value.settings.length - 1 ? "Submit" : "Next"}
                    </Button>
                  </div>
                </Container>
              </Box>
            </Slide>
          ))}
    </Box>
  )
}

export default function SurveyQuestions({
  participant,
  ...props
}: {
  participant: ParticipantObj
  activities: any
  type: string
  onComplete: Function
  closeDialog: Function
}) {
  const [survey, setSurvey] = useState<any>()
  const [prefillData, setPrefillData] = useState(null)
  const [prefillTimestamp, setPrefillTimestamp] = useState(null)
  const responses = useRef(!!prefillData ? Object.assign({}, prefillData) : {})

  useEffect(() => {
    if (props.activities.length === 0) return setSurvey(undefined)
    getSplicedSurveys(props.activities).then((spliced) =>
      setSurvey({
        ...spliced,
        prefillData: !_patientMode() ? props.activities[0].prefillData : undefined,
        prefillTimestamp: !_patientMode() ? props.activities[0].prefillTimestamp : undefined,
      })
    )

    let prefillData = !_patientMode() ? props.activities[0].prefillData : undefined
    setPrefillData({ prefillData })
    let prefillTimestamp = !_patientMode() ? props.activities[0].prefillTimestamp : undefined
    setPrefillTimestamp({ prefillTimestamp })
  }, [])

  const classes = useStyles()

  return (
    <div className={classes.root}>
      {((survey || {}).sections || []).map((x, idx) => (
        <Section
          onResponse={(response) => (responses.current[idx] = response)}
          value={x}
          prefillData={responses.current[idx]}
          type={props.type}
          onComplete={() =>
            props.onComplete(
              Array.from({
                ...responses.current,
                length: survey.sections.length,
              })
            )
          }
          closeDialog={props.closeDialog}
        />
      ))}
    </div>
  )
}
