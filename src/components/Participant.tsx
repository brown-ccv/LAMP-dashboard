// Core Imports
import React, { useState, useEffect } from "react"
import { Box, useTheme, useMediaQuery, Slide } from "@material-ui/core"
import { useSnackbar } from "notistack"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
// Local Imports
import LAMP, { Participant as ParticipantObj } from "lamp-core"
import BottomMenu from "./BottomMenu"
import Survey from "./Survey"
import ResponsiveDialog from "./ResponsiveDialog"
import Prevent from "./Prevent"
import Manage from "./Manage"
import Welcome from "./Welcome"
import Learn from "./Learn"
import Feed from "./Feed"
import SurveyInstrument from "./SurveyInstrument"
import classes from "*.module.css"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scroll: { overflowY: "hidden" },
  })
)

function _hideCareTeam() {
  return (LAMP.Auth._auth.serverAddress || "").includes(".psych.digital")
}
function _patientMode() {
  return LAMP.Auth._type === "participant"
}
async function getShowWelcome(participant: ParticipantObj): Promise<boolean> {
  if (!_patientMode()) return false
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.welcome_dismissed")) as any
  return !!_hidden.error ? true : !(_hidden.data as boolean)
}
async function setShowWelcome(participant: ParticipantObj): Promise<void> {
  await LAMP.Type.setAttachment(participant.id, "me", "lamp.dashboard.welcome_dismissed", true)
}

async function tempHideCareTeam(participant: ParticipantObj): Promise<boolean> {
  if (_hideCareTeam()) return true
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard._nancy")) as any
  return !!_hidden.error ? false : (_hidden.data as boolean)
}

async function addHiddenEvent(
  participant: ParticipantObj,
  timestamp: number,
  activityName: string
): Promise<string[] | undefined> {
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.hidden_events")) as any
  let _events = !!_hidden.error ? [] : _hidden.data
  if (_events.includes(`${timestamp}/${activityName}`)) return _events
  let new_events = [..._events, `${timestamp}/${activityName}`]
  let _setEvents = (await LAMP.Type.setAttachment(
    participant.id,
    "me",
    "lamp.dashboard.hidden_events",
    new_events
  )) as any
  if (!!_setEvents.error) return undefined
  return new_events
}
// Refresh hidden events list.
async function getHiddenEvents(participant: ParticipantObj): Promise<string[]> {
  let _hidden = (await LAMP.Type.getAttachment(participant.id, "lamp.dashboard.hidden_events")) as any
  return !!_hidden.error ? [] : (_hidden.data as string[])
}

function saveTodaysTip(id) {
  let todayTip = {
    type: "tip",
    title: "Today's tip: Sleep",
    timeValue: "08:30 am",
    icon: "sleep_tip",
    description: "Sleep Tips",
    group: "learn",
    completed: false,
    data: [
      {
        title: "Weekends",
        text:
          "Dr. Epstein explains that psychiatric and psychological problems can be related to sleep. To improve " +
          "your sleep, try sticking to a sleep schedule even on the weekends. If you sleep in on the weekends, it " +
          "will be difficult to get back to your routine during the week. Waking up within the same hour everyday " +
          "can help both your physical and mental health over time. For the next seven days, try waking up at the " +
          "same time every day.",
        link:
          "https://www.insider.com/things-that-are-not-helping-your-mental-health-2018-9#those-retail-therapy-sessions-might-make-you-feel-poor-in-more-ways-than-one-5",
      },
    ],
  }
  LAMP.Type.setAttachment(id, "me", "lamp.feed.todays_tip", todayTip)
}
function saveBreatheMusicURL(id) {
  let backgroundMusicURL = { URL: "https://liquidmindmusic.com/mp3/breatheinme.mp3" }
  LAMP.Type.setAttachment(id, "me", "lamp.breathe.music_url", backgroundMusicURL)
}

export default function Participant({
  participant,
  ...props
}: {
  participant: ParticipantObj
  activeTab: Function
  tabValue: string
  surveyDone: boolean
  submitSurvey: Function
  setShowDemoMessage: Function
}) {
  const [activities, setActivities] = useState([])
  const [visibleActivities, setVisibleActivities] = useState([])

  const getTab = () => {
    let tabNum
    switch (props.tabValue) {
      case "Learn":
        tabNum = 0
        break
      case "Assess":
        tabNum = 1
        break
      case "Manage":
        tabNum = 2
        break
      case "Prevent":
        tabNum = 3
        break
      case "Feed":
        tabNum = 4
        break
      default:
        tabNum = _patientMode() ? 1 : 3
        break
    }
    return tabNum
  }

  const [tab, _setTab] = useState(getTab())
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const { enqueueSnackbar } = useSnackbar()
  const [openDialog, setOpen] = useState(false)
  const [hideCareTeam, setHideCareTeam] = useState(_hideCareTeam())
  const [hiddenEvents, setHiddenEvents] = React.useState([])
  const [surveyName, setSurveyName] = useState(null)
  const classes = useStyles()
  const tabDirection = (currentTab) => {
    return supportsSidebar ? "up" : "left"
  }

  const getTabName = (newTab: number) => {
    let tabName = ""
    switch (newTab) {
      case 0:
        tabName = "Learn"
        break
      case 1:
        tabName = "Assess"
        break
      case 2:
        tabName = "Manage"
        break
      case 3:
        tabName = "Prevent"
        break
      case 4:
        tabName = "Feed"
        break
    }
    return tabName
  }

  useEffect(() => {
    const tabName = getTabName(tab)
    props.activeTab(tabName)
    //  getShowWelcome(participant).then(setOpen)
    LAMP.Activity.allByParticipant(participant.id).then(setActivities)
    getHiddenEvents(participant).then(setHiddenEvents)
    tempHideCareTeam(participant).then(setHideCareTeam)
    saveTodaysTip(participant.id)
    saveBreatheMusicURL(participant.id)
  }, [])

  const activeTab = (newTab) => {
    _setTab(newTab)
    const tabName = getTabName(newTab)
    props.activeTab(tabName)
    setVisibleActivities([])
  }

  const hideEvent = async (timestamp?: number, activity?: string) => {
    if (timestamp === undefined && activity === undefined) {
      setHiddenEvents(hiddenEvents) // trigger a reload for dependent components only
      return
    }
    let result = await addHiddenEvent(participant, timestamp, activity)
    if (!!result) {
      setHiddenEvents(result)
    }
  }

  const submitSurvey = (response, overwritingTimestamp) => {
    let events = response.map((x, idx) => ({
      timestamp: new Date().getTime(),
      duration: response.duration,
      activity: visibleActivities[idx].id,
      static_data: {},
      temporal_slices: (x || []).map((y) => ({
        item: y !== undefined ? y.item : null,
        value: y !== undefined ? y.value : null,
        type: null,
        level: null,
        duration: y.duration,
      })),
    }))
    Promise.all(
      events
        .filter((x) => x.temporal_slices.length > 0)
        .map((x) => LAMP.ActivityEvent.create(participant.id, x).catch((e) => console.dir(e)))
    ).then((x) => {
      setVisibleActivities([])
      // If a timestamp was provided to overwrite data, hide the original event too.
      if (!!overwritingTimestamp) hideEvent(overwritingTimestamp, visibleActivities[0 /* assumption made here */].id)
      else hideEvent() // trigger a reload of dependent components anyway
    })
  }

  return (
    <React.Fragment>
      <Box className={classes.scroll}>
        <Slide in={tab === 0} direction={tabDirection(0)} mountOnEnter unmountOnExit>
          <Box mt={1} mb={4}>
            <Learn participant={participant} activeTab={activeTab} />
          </Box>
        </Slide>
        <Slide in={tab === 1} direction={tabDirection(1)} mountOnEnter unmountOnExit>
          <Box mt={1} mb={4}>
            <Survey
              id={participant.id}
              activities={activities}
              visibleActivities={visibleActivities}
              onComplete={submitSurvey}
              setVisibleActivities={setVisibleActivities}
            />
          </Box>
        </Slide>
        <Slide in={tab === 2} direction={tabDirection(2)} mountOnEnter unmountOnExit>
          <Box mt={1} mb={4}>
            <Manage participant={participant} activities={activities} activeTab={activeTab} />
          </Box>
        </Slide>
        <Slide in={tab === 3} direction={tabDirection(3)} mountOnEnter unmountOnExit>
          <Box mt={1} mb={4}>
            <Prevent
              participant={participant}
              activeTab={activeTab}
              hiddenEvents={hiddenEvents}
              enableEditMode={!_patientMode()}
              onEditAction={(activity, data) => {
                setSurveyName(activity.name)
                setVisibleActivities([
                  {
                    ...activity,
                    prefillData: [
                      data.slice.map(({ item, value }) => ({
                        item,
                        value,
                      })),
                    ],
                    prefillTimestamp: data.x.getTime() /* post-increment later to avoid double-reporting events! */,
                  },
                ])
              }}
              onCopyAction={(activity, data) => {
                setSurveyName(activity.name)
                setVisibleActivities([
                  {
                    ...activity,
                    prefillData: [
                      data.slice.map(({ item, value }) => ({
                        item,
                        value,
                      })),
                    ],
                  },
                ])
              }}
              onDeleteAction={(activity, data) => hideEvent(data.x.getTime(), activity.id)}
            />
          </Box>
        </Slide>
        <Slide in={tab === 4} direction={tabDirection(3)} mountOnEnter unmountOnExit>
          <Box mt={1} mb={4}>
            <Feed
              participant={participant}
              activeTab={activeTab}
              activities={activities}
              visibleActivities={visibleActivities}
              onComplete={submitSurvey}
              setVisibleActivities={setVisibleActivities}
            />
          </Box>
        </Slide>
        <BottomMenu
          activeTab={activeTab}
          tabValue={tab}
          showWelcome={openDialog}
          setShowDemoMessage={(val) => props.setShowDemoMessage(val)}
        />
        <ResponsiveDialog open={!!openDialog} transient animate fullScreen>
          <Welcome
            activities={activities}
            onClose={() => {
              setOpen(false)
              setShowWelcome(participant)
            }}
          />
        </ResponsiveDialog>
        <ResponsiveDialog
          transient
          animate
          fullScreen
          open={tab === 3 && visibleActivities.length > 0}
          onClose={() => {
            setVisibleActivities([])
          }}
        >
          <SurveyInstrument
            id={participant.id}
            fromPrevent={true}
            type={surveyName}
            group={visibleActivities}
            setVisibleActivities={setVisibleActivities}
            onComplete={submitSurvey}
          />
        </ResponsiveDialog>
      </Box>
    </React.Fragment>
  )
}
