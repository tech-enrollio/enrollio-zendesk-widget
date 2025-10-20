"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageCircle,
  Newspaper,
  Map,
  Lightbulb,
  HelpCircle,
  X,
  Minus,
  Paperclip,
  Send,
  Search,
  ThumbsUp,
  ExternalLink,
  Home,
  ArrowLeft,
  Headphones,
} from "lucide-react"

type TabType = "home" | "chat" | "news" | "roadmap" | "requests" | "help"

interface Message {
  id: string
  sender: "user" | "agent"
  content: string
  timestamp: string
  author_id?: number
  authorName?: string
  authorPhoto?: string
}

interface ZendeskComment {
  id: number
  body: string
  author_id: number
  created_at: string
  public: boolean
  user?: {
    id: number
    name: string
    photo?: {
      content_url: string
    }
  }
}

interface NewsItem {
  id: string
  title: string
  summary: string
  date: string
  link: string
}

interface Feature {
  id: string
  title: string
  description: string
  status: string
  productArea: string
  voteCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

interface RoadmapItem {
  id: string
  title: string
  description: string
  status: "planned" | "in-progress" | "released"
  emoji: string
  votes: number
}

interface HelpArticle {
  id: number
  title: string
  body: string
  snippet: string
  url: string
  created_at: string
  updated_at: string
}

interface ChatSession {
  ticketId: string
  requesterId: number
  name: string
  email: string
  subject: string
  status: string
  created_at: string
  updated_at: string
}

export default function EnrollioSupportWidget() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("home")
  const [message, setMessage] = useState("")
  const [featureName, setFeatureName] = useState("")
  const [featureEmail, setFeatureEmail] = useState("")
  const [featureTitle, setFeatureTitle] = useState("")
  const [featureDescription, setFeatureDescription] = useState("")
  const [featureProductArea, setFeatureProductArea] = useState<"CRM" | "Class Registration">("CRM")
  const [featureTags, setFeatureTags] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [featureError, setFeatureError] = useState<string | null>(null)
  const [isSubmittingFeature, setIsSubmittingFeature] = useState(false)
  const [latestFeatures, setLatestFeatures] = useState<Feature[]>([])
  const [roadmapFeatures, setRoadmapFeatures] = useState<Feature[]>([])
  const [allLatestFeatures, setAllLatestFeatures] = useState<Feature[]>([])
  const [allRoadmapFeatures, setAllRoadmapFeatures] = useState<Feature[]>([])
  const [displayedNewsCount, setDisplayedNewsCount] = useState(10)
  const [displayedRoadmapCount, setDisplayedRoadmapCount] = useState(10)
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false)
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false)
  const [isLoadingMoreNews, setIsLoadingMoreNews] = useState(false)
  const [isLoadingMoreRoadmap, setIsLoadingMoreRoadmap] = useState(false)
  const [featuresError, setFeaturesError] = useState<string | null>(null)
  const [roadmapError, setRoadmapError] = useState<string | null>(null)
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null)
  const [selectedNewsFeature, setSelectedNewsFeature] = useState<Feature | null>(null)
  const [isSearchingHelp, setIsSearchingHelp] = useState(false)
  const [helpSearchError, setHelpSearchError] = useState<string | null>(null)

  // Chat state
  const [chatMessages, setChatMessages] = useState<Message[]>([])
  const [chatName, setChatName] = useState("")
  const [chatEmail, setChatEmail] = useState("")
  const [isChatStarted, setIsChatStarted] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [requesterId, setRequesterId] = useState<number | null>(null)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [previousChats, setPreviousChats] = useState<ChatSession[]>([])
  const [showEmailLookup, setShowEmailLookup] = useState(false)
  const [lookupEmail, setLookupEmail] = useState("")
  const [isLoadingChats, setIsLoadingChats] = useState(false)

  const newsObserverRef = useRef<IntersectionObserver | null>(null)
  const roadmapObserverRef = useRef<IntersectionObserver | null>(null)
  const newsLoadMoreRef = useRef<HTMLDivElement>(null)
  const roadmapLoadMoreRef = useRef<HTMLDivElement>(null)

  // Mock data for news items (not used anymore)
  const newsItems: NewsItem[] = [
    {
      id: "1",
      title: "New Payment Gateway Integration",
      summary: "We've added support for Stripe Connect to streamline your payment processing.",
      date: "2 days ago",
      link: "#",
    },
    {
      id: "2",
      title: "Enhanced Reporting Dashboard",
      summary: "Get deeper insights with our new analytics and reporting features.",
      date: "1 week ago",
      link: "#",
    },
    {
      id: "3",
      title: "Mobile App Updates",
      summary: "Our iOS and Android apps now support offline mode and push notifications.",
      date: "2 weeks ago",
      link: "#",
    },
  ]

  const roadmapItems: RoadmapItem[] = [
    {
      id: "1",
      title: "Advanced Scheduling",
      description: "Recurring classes and automated waitlists",
      status: "in-progress",
      emoji: "📅",
      votes: 47,
    },
    {
      id: "2",
      title: "White Label Solution",
      description: "Custom branding for your enrollment portal",
      status: "planned",
      emoji: "🎨",
      votes: 32,
    },
    {
      id: "3",
      title: "SMS Notifications",
      description: "Automated text reminders for students",
      status: "released",
      emoji: "📱",
      votes: 89,
    },
    {
      id: "4",
      title: "API Access",
      description: "Developer API for custom integrations",
      status: "planned",
      emoji: "🔌",
      votes: 56,
    },
  ]

  const helpLinks = [
    { title: "Getting Started Guide", icon: "🚀", url: "https://enrollio-98596.zendesk.com/hc/en-us/articles/40183974730011--DAY-1-Getting-Everything-Connected-Enrollio-Overview" },
    { title: "Connect Stripe Payment", icon: "💳", url: "https://enrollio-98596.zendesk.com/hc/en-us/articles/40184159105307-Connect-Stripe-for-Payment" },
    { title: "Manage Enrollments", icon: "📋", url: "https://enrollio-98596.zendesk.com/hc/en-us/articles/40184234351003-Understanding-Opportunities-in-Enrollio" },
    { title: "Set Up Classes", icon: "🎓", url: "https://enrollio-98596.zendesk.com/hc/en-us/articles/40184289123355-How-to-Set-Up-Multiple-Class-Calendars-Group-Class-Calendar" },
    { title: "Student Communication", icon: "💬", url: "https://enrollio-98596.zendesk.com/hc/en-us/articles/40184100666011-Improved-Number-Validation-for-Accurate-Communication-in-Enrollio" },
    { title: "Billing & Invoices", icon: "💰", url: "https://enrollio-98596.zendesk.com/hc/en-us/articles/40184299544859-Enrollio-Billing-Dashboard" },
  ]

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return date.toLocaleDateString()
  }

  // Helper function to map API status to roadmap status
  const mapStatusToRoadmap = (status: string): "planned" | "in-progress" | "released" => {
    const statusMap: Record<string, "planned" | "in-progress" | "released"> = {
      PLANNED: "planned",
      IN_PROGRESS: "in-progress",
      COMPLETED: "released",
      RELEASED: "released",
    }
    return statusMap[status] || "planned"
  }

  // Helper function to get emoji based on product area or default
  const getEmojiForFeature = (productArea: string): string => {
    const emojiMap: Record<string, string> = {
      REGISTRATION: "📝",
      CRM: "👥",
      PAYMENTS: "💳",
      SCHEDULING: "📅",
      NOTIFICATIONS: "🔔",
      REPORTS: "📊",
      INTEGRATIONS: "🔌",
    }
    return emojiMap[productArea] || "✨"
  }

  // Load previous chats from localStorage on mount
  useEffect(() => {
    const loadLocalChats = () => {
      try {
        const stored = localStorage.getItem("enrollio_chat_sessions")
        if (stored) {
          const sessions: ChatSession[] = JSON.parse(stored)
          // Sort by most recent first
          sessions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          setPreviousChats(sessions.slice(0, 5)) // Show max 5 recent chats
        }
      } catch (error) {
        console.error("Error loading chats from localStorage:", error)
      }
    }

    loadLocalChats()
  }, [])

  // Auto-populate name and email from most recent chat session
  useEffect(() => {
    if (previousChats.length > 0 && !chatName && !chatEmail) {
      const mostRecentChat = previousChats[0]
      setChatName(mostRecentChat.name)
      setChatEmail(mostRecentChat.email)
    }
  }, [previousChats, chatName, chatEmail])

  // Save chat session to localStorage
  const saveChatToLocal = (session: ChatSession) => {
    try {
      const stored = localStorage.getItem("enrollio_chat_sessions")
      const sessions: ChatSession[] = stored ? JSON.parse(stored) : []

      // Check if session already exists, update it
      const existingIndex = sessions.findIndex((s) => s.ticketId === session.ticketId)
      if (existingIndex >= 0) {
        sessions[existingIndex] = session
      } else {
        sessions.unshift(session) // Add to beginning
      }

      // Keep only last 10 sessions
      const recentSessions = sessions.slice(0, 10)
      localStorage.setItem("enrollio_chat_sessions", JSON.stringify(recentSessions))

      // Update state
      setPreviousChats(recentSessions.slice(0, 5))
    } catch (error) {
      console.error("Error saving chat to localStorage:", error)
    }
  }

  // Load chats by email from Zendesk
  const loadChatsByEmail = async (email: string) => {
    setIsLoadingChats(true)
    try {
      const response = await fetch(`/api/chat/get-user-tickets?email=${encodeURIComponent(email)}`)
      if (!response.ok) throw new Error("Failed to fetch tickets")

      const data = await response.json()
      const tickets = data.tickets || []

      const sessions: ChatSession[] = tickets.map((ticket: any) => ({
        ticketId: ticket.id.toString(),
        requesterId: ticket.requester_id,
        name: ticket.requester?.name || "Unknown",
        email: email,
        subject: ticket.subject,
        status: ticket.status,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
      }))

      setPreviousChats(sessions)

      // Also save to localStorage
      sessions.forEach((session) => saveChatToLocal(session))
    } catch (error) {
      console.error("Error loading chats by email:", error)
      alert("Failed to load chats. Please try again.")
    } finally {
      setIsLoadingChats(false)
      setShowEmailLookup(false)
    }
  }

  // Resume an existing chat
  const resumeChat = (session: ChatSession) => {
    setTicketId(session.ticketId)
    setRequesterId(session.requesterId)
    setChatName(session.name)
    setChatEmail(session.email)
    setIsChatStarted(true)
    setChatMessages([]) // Will be loaded by polling
  }

  // Reset chat to initial state (show Recent Chats view)
  const resetChatView = () => {
    setIsChatStarted(false)
    setTicketId(null)
    setRequesterId(null)
    setChatMessages([])
  }

  // Fetch latest features from API
  useEffect(() => {
    const fetchLatestFeatures = async () => {
      setIsLoadingFeatures(true)
      setFeaturesError(null)

      try {
        const response = await fetch("/api/features")
        if (!response.ok) {
          throw new Error("Failed to fetch features")
        }

        const data = await response.json()

        // Filter for completed features and sort by most recent
        const completedFeatures = data.features
          .filter((feature: Feature) => feature.status === "COMPLETED")
          .sort((a: Feature, b: Feature) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )

        setAllLatestFeatures(completedFeatures)
        setLatestFeatures(completedFeatures.slice(0, 10))
      } catch (error) {
        console.error("Error fetching features:", error)
        setFeaturesError("Unable to load latest updates")
      } finally {
        setIsLoadingFeatures(false)
      }
    }

    fetchLatestFeatures()
  }, [])

  // Fetch roadmap features from API
  useEffect(() => {
    const fetchRoadmapFeatures = async () => {
      setIsLoadingRoadmap(true)
      setRoadmapError(null)

      try {
        const response = await fetch("/api/features")
        if (!response.ok) {
          throw new Error("Failed to fetch roadmap")
        }

        const data = await response.json()

        // Filter for planned, in-progress, and recently released features
        const roadmapFeatures = data.features
          .filter((feature: Feature) =>
            ["PLANNED", "IN_PROGRESS", "COMPLETED"].includes(feature.status)
          )
          .sort((a: Feature, b: Feature) => {
            // Sort by vote count descending (most votes first)
            const voteDiff = b.voteCount - a.voteCount
            if (voteDiff !== 0) return voteDiff

            // Then by most recent date as tiebreaker
            // Use createdAt as fallback if updatedAt is not available
            const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
            const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
            return dateB - dateA
          })

        setAllRoadmapFeatures(roadmapFeatures)
        setRoadmapFeatures(roadmapFeatures.slice(0, 10))
      } catch (error) {
        console.error("Error fetching roadmap:", error)
        setRoadmapError("Unable to load roadmap")
      } finally {
        setIsLoadingRoadmap(false)
      }
    }

    fetchRoadmapFeatures()
  }, [])

  // Load more news items
  const loadMoreNews = useCallback(() => {
    if (isLoadingMoreNews || displayedNewsCount >= allLatestFeatures.length) return

    setIsLoadingMoreNews(true)
    setTimeout(() => {
      const newCount = Math.min(displayedNewsCount + 10, allLatestFeatures.length)
      setDisplayedNewsCount(newCount)
      setLatestFeatures(allLatestFeatures.slice(0, newCount))
      setIsLoadingMoreNews(false)
    }, 500)
  }, [displayedNewsCount, allLatestFeatures, isLoadingMoreNews])

  // Load more roadmap items
  const loadMoreRoadmapRef = useRef(false)
  const loadMoreRoadmap = useCallback(() => {
    // Prevent multiple simultaneous loads
    if (loadMoreRoadmapRef.current || displayedRoadmapCount >= allRoadmapFeatures.length) return

    loadMoreRoadmapRef.current = true
    setIsLoadingMoreRoadmap(true)

    setTimeout(() => {
      const newCount = Math.min(displayedRoadmapCount + 10, allRoadmapFeatures.length)
      setDisplayedRoadmapCount(newCount)
      setRoadmapFeatures(allRoadmapFeatures.slice(0, newCount))
      setIsLoadingMoreRoadmap(false)
      loadMoreRoadmapRef.current = false
    }, 500)
  }, [displayedRoadmapCount, allRoadmapFeatures])

  // Set up intersection observer for news
  useEffect(() => {
    if (newsObserverRef.current) newsObserverRef.current.disconnect()

    newsObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreNews()
        }
      },
      { threshold: 0.1 }
    )

    if (newsLoadMoreRef.current) {
      newsObserverRef.current.observe(newsLoadMoreRef.current)
    }

    return () => {
      if (newsObserverRef.current) newsObserverRef.current.disconnect()
    }
  }, [loadMoreNews])

  // Set up intersection observer for roadmap
  useEffect(() => {
    if (roadmapObserverRef.current) roadmapObserverRef.current.disconnect()

    roadmapObserverRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && activeTab === "roadmap") {
          loadMoreRoadmap()
        }
      },
      { threshold: 0.1 }
    )

    if (roadmapLoadMoreRef.current && activeTab === "roadmap") {
      roadmapObserverRef.current.observe(roadmapLoadMoreRef.current)
    }

    return () => {
      if (roadmapObserverRef.current) roadmapObserverRef.current.disconnect()
    }
  }, [loadMoreRoadmap, activeTab])

  // Search help center articles with debouncing
  useEffect(() => {
    const searchHelpArticles = async (query: string) => {
      if (!query.trim()) {
        setHelpArticles([])
        setHelpSearchError(null)
        return
      }

      setIsSearchingHelp(true)
      setHelpSearchError(null)

      try {
        const response = await fetch(`/api/help-center?query=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error("Failed to search help articles")
        }

        const data = await response.json()
        setHelpArticles(data.results || [])
      } catch (error) {
        console.error("Error searching help articles:", error)
        setHelpSearchError("Unable to search help articles")
        setHelpArticles([])
      } finally {
        setIsSearchingHelp(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchHelpArticles(searchQuery)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Poll for new messages from agents
  useEffect(() => {
    if (!ticketId || !isChatStarted || !requesterId) return

    const pollMessages = async () => {
      try {
        setIsLoadingMessages(true)
        const response = await fetch(`/api/chat/get-messages?ticketId=${ticketId}`)
        if (!response.ok) throw new Error("Failed to fetch messages")

        const data = await response.json()
        const comments: ZendeskComment[] = data.comments || []

        // Convert Zendesk comments to messages
        // Compare author_id with requesterId to determine if it's from the user or agent
        const formattedMessages: Message[] = comments.map((comment) => ({
          id: comment.id.toString(),
          sender: comment.author_id === requesterId ? "user" : "agent",
          content: comment.body,
          timestamp: new Date(comment.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          author_id: comment.author_id,
          authorName: comment.user?.name || "Unknown",
          authorPhoto: comment.user?.photo?.content_url,
        }))

        setChatMessages(formattedMessages)
      } catch (error) {
        console.error("Error polling messages:", error)
      } finally {
        setIsLoadingMessages(false)
      }
    }

    // Poll immediately
    pollMessages()

    // Then poll every 5 seconds
    const interval = setInterval(pollMessages, 5000)
    return () => clearInterval(interval)
  }, [ticketId, isChatStarted, requesterId])

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatName.trim() || !chatEmail.trim() || !message.trim()) return

    setIsSendingMessage(true)
    try {
      const response = await fetch("/api/chat/create-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: chatName,
          email: chatEmail,
          message: message,
        }),
      })

      if (!response.ok) throw new Error("Failed to create ticket")

      const data = await response.json()
      setTicketId(data.ticketId)
      setRequesterId(data.requesterId)
      setIsChatStarted(true)

      // Save chat session to localStorage
      const newSession: ChatSession = {
        ticketId: data.ticketId,
        requesterId: data.requesterId,
        name: chatName,
        email: chatEmail,
        subject: `Chat from ${chatName}`,
        status: "open",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      saveChatToLocal(newSession)

      // Add user message to chat
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "user",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setChatMessages([newMessage])
      setMessage("")
    } catch (error) {
      console.error("Error starting chat:", error)
      alert("Failed to start chat. Please try again.")
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim() || !ticketId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    // Optimistically add message to UI
    setChatMessages((prev) => [...prev, userMessage])
    const messageToSend = message
    setMessage("")

    setIsSendingMessage(true)
    try {
      const response = await fetch("/api/chat/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticketId,
          message: messageToSend,
        }),
      })

      if (!response.ok) throw new Error("Failed to send message")
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove optimistic message on error
      setChatMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
      setMessage(messageToSend) // Restore message
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSendingMessage(false)
    }
  }

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeatureError(null) // Clear previous errors

    // Validation: Check title and description length
    if (featureTitle.trim().length < 5) {
      setFeatureError("Title must be at least 5 characters long.")
      return
    }

    if (featureDescription.trim().length < 10) {
      setFeatureError("Description must be at least 10 characters long.")
      return
    }

    setIsSubmittingFeature(true)

    try {
      // Parse tags from comma-separated string to array
      const tagsArray = featureTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const payload = {
        title: featureTitle,
        description: featureDescription,
        productArea: featureProductArea,
        tags: tagsArray,
        authorName: featureName,
        authorEmail: featureEmail,
      }

      // Log submission details
      console.log("Feature Request Submission:")
      console.log("Endpoint:", "/api/features/submit (proxy to https://feedback.enrollio.ai/api/boards/crm/features)")
      console.log("Payload:", payload)

      const response = await fetch("/api/features/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)

        // Extract error message
        let errorMessage = "Failed to submit feature request."
        if (errorData.details) {
          if (typeof errorData.details === 'string') {
            errorMessage += ` ${errorData.details}`
          } else if (errorData.details.message) {
            errorMessage += ` ${errorData.details.message}`
          } else if (errorData.details.error) {
            errorMessage += ` ${errorData.details.error}`
          }
        }

        throw new Error(errorMessage)
      }

      // Show success message
      setSubmitted(true)
      setFeatureError(null) // Clear any errors
      setTimeout(() => {
        setSubmitted(false)
        setFeatureName("")
        setFeatureEmail("")
        setFeatureTitle("")
        setFeatureDescription("")
        setFeatureProductArea("CRM")
        setFeatureTags("")
      }, 3000)
    } catch (error) {
      console.error("Error submitting feature request:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to submit feature request. Please try again."
      setFeatureError(errorMessage)
    } finally {
      setIsSubmittingFeature(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card
          className="w-[400px] shadow-2xl transition-all duration-300 ease-in-out bg-white border-gray-200"
          style={{
            borderRadius: "20px",
            height: isMinimized ? "60px" : "600px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white relative">
            <div className="flex items-center gap-2">
              {activeTab !== "home" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100 transition-all -ml-2"
                  onClick={() => setActiveTab("home")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <img
                src="https://storage.googleapis.com/msgsndr/t34wsZgFiq6fyBrps0Ps/media/68e7abeba54d88c1ec18f4d0.png"
                alt="Enrollio Support"
                className="h-6 object-contain"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100 transition-all"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-black hover:bg-gray-100 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFC300] to-transparent" />
          </div>

          {/* Content */}
          {!isMinimized && (
            <>
              <ScrollArea className="h-[420px] bg-white">
                <div className="p-4 pb-4">
                  {/* Home Tab */}
                  {activeTab === "home" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3"
                    >
                      <div className="text-center py-2">
                        <h2 className="text-xl font-bold mb-1" style={{ color: "#000814" }}>
                          How can we help you today? 💛
                        </h2>
                        <p className="text-gray-600 text-xs">Choose an option below to get started</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            resetChatView()
                            setActiveTab("chat")
                          }}
                          className="p-3 rounded-xl border border-gray-200 transition-all bg-white hover:border-[#FFC300]"
                        >
                          <MessageCircle className="h-5 w-5 mb-1.5" style={{ color: "#000814" }} />
                          <div className="text-left">
                            <div className="font-semibold text-black text-sm">Chat</div>
                            <div className="text-xs text-gray-500">Talk to Support</div>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab("news")}
                          className="p-3 rounded-xl border border-gray-200 transition-all bg-white hover:border-[#FFC300]"
                        >
                          <Newspaper className="h-5 w-5 mb-1.5" style={{ color: "#000814" }} />
                          <div className="text-left">
                            <div className="font-semibold text-black text-sm">News</div>
                            <div className="text-xs text-gray-500">Latest Updates</div>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab("roadmap")}
                          className="p-3 rounded-xl border border-gray-200 transition-all bg-white hover:border-[#FFC300]"
                        >
                          <Map className="h-5 w-5 mb-1.5" style={{ color: "#000814" }} />
                          <div className="text-left">
                            <div className="font-semibold text-black text-sm">Roadmap</div>
                            <div className="text-xs text-gray-500">What's Coming</div>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab("requests")}
                          className="p-3 rounded-xl border border-gray-200 transition-all bg-white hover:border-[#FFC300]"
                        >
                          <Lightbulb className="h-5 w-5 mb-1.5" style={{ color: "#000814" }} />
                          <div className="text-left">
                            <div className="font-semibold text-black text-sm">Requests</div>
                            <div className="text-xs text-gray-500">Share Ideas</div>
                          </div>
                        </motion.button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab("help")}
                          className="p-3 rounded-xl border border-gray-200 transition-all bg-white hover:border-[#FFC300]"
                        >
                          <HelpCircle className="h-5 w-5 mb-1.5" style={{ color: "#000814" }} />
                          <div className="text-left">
                            <div className="font-semibold text-black text-sm">Help Center</div>
                            <div className="text-xs text-gray-500">Browse Tutorials and FAQs</div>
                          </div>
                        </motion.button>

                        <motion.a
                          href="https://enrollio.ai/express-setup"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 195, 0, 0.3)" }}
                          whileTap={{ scale: 0.98 }}
                          className="p-3 rounded-xl border border-gray-200 transition-all bg-white hover:border-[#FFC300] block no-underline"
                        >
                          <Headphones className="h-5 w-5 mb-1.5" style={{ color: "#000814" }} />
                          <div className="text-left">
                            <div className="font-semibold text-black text-sm">Setup Assistance</div>
                            <div className="text-xs text-gray-500">Have our experts build out your account</div>
                          </div>
                        </motion.a>
                      </div>
                    </motion.div>
                  )}

                  {/* Chat Tab */}
                  {activeTab === "chat" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-1" style={{ color: "#000814" }}>
                          Chat with Enrollio Support 💬
                        </h3>
                        <p className="text-sm text-gray-600">We're here to help you 7 days a week.</p>
                      </div>

                      {!isChatStarted ? (
                        <>
                          {/* Previous Chats List */}
                          {previousChats.length > 0 && (
                            <div className="space-y-3 mb-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold text-gray-600">Recent Chats</h4>
                              </div>

                              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                {previousChats.map((chat) => (
                                  <motion.button
                                    key={chat.ticketId}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => resumeChat(chat)}
                                    className="w-full p-3 rounded-lg border border-gray-200 hover:border-[#FFC300] transition-all text-left bg-white"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <p className="text-sm font-semibold text-[#000814] truncate">{chat.subject}</p>
                                          <Badge
                                            variant="secondary"
                                            className="text-xs flex-shrink-0"
                                            style={{
                                              backgroundColor:
                                                chat.status === "open"
                                                  ? "#FFC300"
                                                  : chat.status === "pending"
                                                    ? "#FFD60A"
                                                    : "#F3F4F6",
                                              color: chat.status === "solved" ? "#6B7280" : "#000814",
                                            }}
                                          >
                                            {chat.status}
                                          </Badge>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          {new Date(chat.updated_at).toLocaleDateString()} •{" "}
                                          {new Date(chat.updated_at).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </p>
                                      </div>
                                    </div>
                                  </motion.button>
                                ))}
                              </div>

                              <div className="border-t border-gray-200 pt-3">
                                <p className="text-xs text-center text-gray-500 mb-3">Or start a new conversation</p>
                              </div>
                            </div>
                          )}

                          {/* Chat start form */}
                          <form onSubmit={handleStartChat} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium" style={{ color: "#000814" }}>
                              Name
                            </label>
                            <Input
                              placeholder="Your name"
                              value={chatName}
                              onChange={(e) => setChatName(e.target.value)}
                              required
                              className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium" style={{ color: "#000814" }}>
                              Email
                            </label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={chatEmail}
                              onChange={(e) => setChatEmail(e.target.value)}
                              required
                              className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium" style={{ color: "#000814" }}>
                              How can we help you?
                            </label>
                            <Textarea
                              placeholder="Describe your question or issue..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              required
                              rows={4}
                              className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300] resize-none"
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSendingMessage}
                            className="w-full font-semibold transition-all hover:shadow-[0_0_20px_rgba(255,195,0,0.5)]"
                            style={{ backgroundColor: "#FFC300", color: "#000814" }}
                          >
                            {isSendingMessage ? (
                              <>
                                <div className="h-4 w-4 mr-2 border-2 border-[#000814] border-t-transparent rounded-full animate-spin" />
                                Starting Chat...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Start Chat
                              </>
                            )}
                          </Button>
                        </form>
                      </>
                      ) : (
                        /* Chat messages and input */
                        <>
                          <div className="space-y-4 min-h-[200px] max-h-[280px] overflow-y-auto px-1">
                            {chatMessages.length === 0 ? (
                              <div className="text-center py-8">
                                <p className="text-sm text-gray-500">Your message has been sent!</p>
                                <p className="text-xs text-gray-400 mt-1">An agent will respond shortly.</p>
                              </div>
                            ) : (
                              chatMessages.map((msg) => (
                                <div key={msg.id} className="flex gap-3 items-start">
                                  <Avatar className="h-8 w-8 flex-shrink-0 mt-0.5">
                                    {msg.sender === "agent" && msg.authorPhoto ? (
                                      <AvatarImage src={msg.authorPhoto} alt={msg.authorName || "Agent"} />
                                    ) : null}
                                    <AvatarFallback
                                      style={{
                                        backgroundColor: msg.sender === "user" ? "#FFC300" : "#000814",
                                        color: msg.sender === "user" ? "#000814" : "#FFC300",
                                      }}
                                    >
                                      {msg.sender === "user"
                                        ? (chatName || msg.authorName || "U").charAt(0).toUpperCase()
                                        : (msg.authorName || "A").charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 mb-1">
                                      {msg.authorName && (
                                        <span className="text-xs font-medium text-gray-700">
                                          {msg.sender === "user" ? chatName || msg.authorName : msg.authorName}
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                    </div>
                                    <div
                                      className="rounded-lg px-3 py-2 text-sm break-words"
                                      style={{
                                        backgroundColor: msg.sender === "user" ? "#FFC300" : "#F3F4F6",
                                        color: "#000814",
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "pre-wrap",
                                      }}
                                    >
                                      {msg.content}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>

                          <div className="space-y-2 pt-4 border-t border-gray-100">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                                disabled={isSendingMessage}
                                className="flex-1 bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                              />
                            </div>
                            <Button
                              onClick={handleSendMessage}
                              disabled={isSendingMessage || !message.trim()}
                              className="w-full font-semibold transition-all hover:shadow-[0_0_20px_rgba(255,195,0,0.5)]"
                              style={{ backgroundColor: "#FFC300", color: "#000814" }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              {isSendingMessage ? "Sending..." : "Send Message"}
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* News Tab */}
                  {activeTab === "news" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Article detail view */}
                      {selectedNewsFeature ? (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedNewsFeature(null)}
                              className="text-gray-500 hover:text-[#000814] -ml-2"
                            >
                              <ArrowLeft className="h-4 w-4 mr-1" />
                              Back to updates
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-semibold leading-tight" style={{ color: "#000814" }}>
                                  {selectedNewsFeature.title}
                                </h3>
                                {selectedNewsFeature.productArea && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                    style={{
                                      backgroundColor: "#F3F4F6",
                                      color: "#6B7280",
                                    }}
                                  >
                                    {selectedNewsFeature.productArea}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                Released {formatDate(selectedNewsFeature.updatedAt)}
                              </p>
                            </div>
                            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                              {selectedNewsFeature.description}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h3 className="text-lg font-semibold mb-1" style={{ color: "#000814" }}>
                              Latest Updates 🗞️
                            </h3>
                            <p className="text-sm text-gray-600">Stay updated with our latest features</p>
                          </div>

                          {isLoadingFeatures ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center space-y-3">
                            <div className="h-8 w-8 mx-auto border-4 border-gray-200 border-t-[#FFC300] rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">Loading latest updates...</p>
                          </div>
                        </div>
                      ) : featuresError ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">{featuresError}</p>
                            <Button
                              size="sm"
                              onClick={() => window.location.reload()}
                              style={{ backgroundColor: "#FFC300", color: "#000814" }}
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      ) : latestFeatures.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                          <p className="text-sm text-gray-500">No updates available at the moment</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {latestFeatures.map((feature, index) => (
                            <motion.div
                              key={feature.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Card
                                onClick={() => setSelectedNewsFeature(feature)}
                                className="transition-all hover:scale-[1.02] hover:shadow-lg cursor-pointer bg-white border-gray-200"
                                style={{
                                  borderLeft: "3px solid #FFC300",
                                }}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between gap-2">
                                    <CardTitle
                                      className="text-sm font-semibold leading-relaxed"
                                      style={{ color: "#000814" }}
                                    >
                                      {feature.title}
                                    </CardTitle>
                                    {feature.productArea && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                        style={{
                                          backgroundColor: "#F3F4F6",
                                          color: "#6B7280",
                                        }}
                                      >
                                        {feature.productArea}
                                      </Badge>
                                    )}
                                  </div>
                                  <CardDescription className="text-xs text-gray-500">
                                    {formatDate(feature.updatedAt)}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <p className="text-sm text-gray-700 leading-relaxed">{feature.description}</p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Load more trigger */}
                      {latestFeatures.length < allLatestFeatures.length && (
                        <div ref={newsLoadMoreRef} className="py-4">
                          {isLoadingMoreNews ? (
                            <div className="flex items-center justify-center">
                              <div className="h-6 w-6 border-3 border-gray-200 border-t-[#FFC300] rounded-full animate-spin" />
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={loadMoreNews}
                              className="w-full text-gray-600 hover:text-[#000814] hover:bg-gray-100"
                            >
                              Load more updates...
                            </Button>
                          )}
                        </div>
                      )}

                          <p className="text-xs text-center text-gray-500 pt-2">
                            Showing {latestFeatures.length} of {allLatestFeatures.length} completed features
                          </p>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* Roadmap Tab */}
                  {activeTab === "roadmap" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-1" style={{ color: "#000814" }}>
                          Product Roadmap 🧭
                        </h3>
                        <p className="text-sm text-gray-600">See what we're building next</p>
                      </div>

                      {isLoadingRoadmap ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center space-y-3">
                            <div className="h-8 w-8 mx-auto border-4 border-gray-200 border-t-[#FFC300] rounded-full animate-spin" />
                            <p className="text-sm text-gray-500">Loading roadmap...</p>
                          </div>
                        </div>
                      ) : roadmapError ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center space-y-2">
                            <p className="text-sm text-gray-600">{roadmapError}</p>
                            <Button
                              size="sm"
                              onClick={() => window.location.reload()}
                              style={{ backgroundColor: "#FFC300", color: "#000814" }}
                            >
                              Try Again
                            </Button>
                          </div>
                        </div>
                      ) : roadmapFeatures.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                          <p className="text-sm text-gray-500">No roadmap items available</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {roadmapFeatures.map((feature, index) => {
                            const mappedStatus = mapStatusToRoadmap(feature.status)
                            return (
                              <motion.div
                                key={feature.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Card className="transition-all hover:scale-[1.02] hover:shadow-lg bg-white border-gray-200">
                                  <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl">{getEmojiForFeature(feature.productArea)}</span>
                                        <CardTitle className="text-sm font-semibold" style={{ color: "#000814" }}>
                                          {feature.title}
                                        </CardTitle>
                                      </div>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs flex-shrink-0"
                                        style={{
                                          backgroundColor:
                                            mappedStatus === "released"
                                              ? "#FFD60A"
                                              : mappedStatus === "in-progress"
                                                ? "#FFC300"
                                                : "#F3F4F6",
                                          color: mappedStatus === "planned" ? "#6B7280" : "#000814",
                                        }}
                                      >
                                        {mappedStatus === "released"
                                          ? "Released"
                                          : mappedStatus === "in-progress"
                                            ? "In Progress"
                                            : "Planned"}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <p className="text-sm text-gray-700 mb-3 leading-relaxed">{feature.description}</p>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-xs h-7 px-3 hover:bg-gray-100"
                                      style={{ color: "#000814" }}
                                    >
                                      <ThumbsUp className="h-3 w-3 mr-1" />
                                      {feature.voteCount} votes
                                    </Button>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            )
                          })}
                        </div>
                      )}

                      {/* Load more trigger */}
                      {roadmapFeatures.length < allRoadmapFeatures.length && (
                        <>
                          <div ref={roadmapLoadMoreRef} className="h-4" />
                          {isLoadingMoreRoadmap && (
                            <div className="flex items-center justify-center py-4">
                              <div className="h-6 w-6 border-3 border-gray-200 border-t-[#FFC300] rounded-full animate-spin" />
                            </div>
                          )}
                        </>
                      )}

                      <p className="text-xs text-center text-gray-500 pt-2">
                        Showing {roadmapFeatures.length} of {allRoadmapFeatures.length} roadmap items
                      </p>
                    </motion.div>
                  )}

                  {/* Feature Requests Tab */}
                  {activeTab === "requests" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-1" style={{ color: "#000814" }}>
                          Share Your Ideas 💡
                        </h3>
                        <p className="text-sm text-gray-600">Share your ideas with our team</p>
                      </div>

                      {/* Error Notification */}
                      <AnimatePresence>
                        {featureError && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Card
                              className="p-4 text-center bg-white"
                              style={{
                                borderColor: "#DC2626",
                                borderWidth: "2px",
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="text-2xl">⚠️</div>
                                <div className="flex-1 text-left">
                                  <h4 className="font-semibold mb-1" style={{ color: "#DC2626" }}>
                                    Validation Error
                                  </h4>
                                  <p className="text-sm text-gray-700">{featureError}</p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setFeatureError(null)}
                                  className="h-6 w-6 p-0 -mt-1"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        {submitted ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <Card
                              className="p-6 text-center bg-white"
                              style={{
                                borderColor: "#FFC300",
                                borderWidth: "2px",
                              }}
                            >
                              <div className="text-4xl mb-3">✅</div>
                              <h4 className="font-semibold mb-2" style={{ color: "#000814" }}>
                                Thanks! Our team reviews feature requests weekly.
                              </h4>
                            </Card>
                          </motion.div>
                        ) : (
                          <motion.form
                            key="form"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onSubmit={handleFeatureSubmit}
                            className="space-y-3"
                          >
                            <div className="space-y-2">
                              <label className="text-sm font-medium" style={{ color: "#000814" }}>
                                Title <span className="text-red-500">*</span>
                              </label>
                              <Input
                                placeholder="Brief title for your feature"
                                value={featureTitle}
                                onChange={(e) => setFeatureTitle(e.target.value)}
                                required
                                className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium" style={{ color: "#000814" }}>
                                Description <span className="text-red-500">*</span>
                              </label>
                              <Textarea
                                placeholder="Describe your feature idea in detail..."
                                value={featureDescription}
                                onChange={(e) => setFeatureDescription(e.target.value)}
                                required
                                rows={3}
                                className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300] resize-none"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium" style={{ color: "#000814" }}>
                                Product Area <span className="text-red-500">*</span>
                              </label>
                              <Select value={featureProductArea} onValueChange={(value: "CRM" | "Class Registration") => setFeatureProductArea(value)} required>
                                <SelectTrigger className="bg-white border-gray-200 text-black focus:border-[#FFC300] focus:ring-[#FFC300]">
                                  <SelectValue placeholder="Select product area" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CRM">CRM</SelectItem>
                                  <SelectItem value="Class Registration">Class Registration</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium" style={{ color: "#000814" }}>
                                Tags
                              </label>
                              <Input
                                placeholder="integration, calendar, sync (comma-separated)"
                                value={featureTags}
                                onChange={(e) => setFeatureTags(e.target.value)}
                                className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                              />
                              <p className="text-xs text-gray-500">Separate multiple tags with commas</p>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium" style={{ color: "#000814" }}>
                                Name
                              </label>
                              <Input
                                placeholder="Your name"
                                value={featureName}
                                onChange={(e) => setFeatureName(e.target.value)}
                                className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium" style={{ color: "#000814" }}>
                                Email
                              </label>
                              <Input
                                type="email"
                                placeholder="your@email.com"
                                value={featureEmail}
                                onChange={(e) => setFeatureEmail(e.target.value)}
                                className="bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                              />
                            </div>

                            <Button
                              type="submit"
                              disabled={isSubmittingFeature}
                              className="w-full font-semibold transition-all hover:shadow-[0_0_30px_rgba(255,195,0,0.6)]"
                              style={{
                                background: "linear-gradient(135deg, #FFC300 0%, #FFD60A 100%)",
                                color: "#000814",
                              }}
                            >
                              {isSubmittingFeature ? (
                                <>
                                  <div className="h-4 w-4 mr-2 border-2 border-[#000814] border-t-transparent rounded-full animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                "Submit Feature Request"
                              )}
                            </Button>
                          </motion.form>
                        )}
                      </AnimatePresence>

                      <p className="text-xs text-center text-gray-500 pt-2">
                        Your feature request will be saved to our product board
                      </p>
                    </motion.div>
                  )}

                  {/* Help Tab */}
                  {activeTab === "help" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Article view */}
                      {selectedArticle ? (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedArticle(null)}
                              className="text-gray-500 hover:text-[#000814] -ml-2"
                            >
                              <ArrowLeft className="h-4 w-4 mr-1" />
                              Back to results
                            </Button>
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold leading-tight" style={{ color: "#000814" }}>
                              {selectedArticle.title}
                            </h3>
                            <div
                              className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none [&_p]:mb-3 [&_ul]:mb-3 [&_ol]:mb-3 [&_li]:mb-1 [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:mt-3 [&_h3]:mb-2 [&_strong]:font-semibold [&_em]:font-medium"
                              dangerouslySetInnerHTML={{ __html: selectedArticle.body }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <h3 className="text-lg font-semibold mb-1" style={{ color: "#000814" }}>
                              Help Center 🔍
                            </h3>
                            <p className="text-sm text-gray-600">Find answers and tutorials</p>
                          </div>

                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search tutorials, FAQs, or setup guides..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 bg-white border-gray-200 text-black placeholder:text-gray-400 focus:border-[#FFC300] focus:ring-[#FFC300]"
                            />
                          </div>

                          {/* Search results */}
                          {searchQuery.trim() ? (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                Search Results
                              </h4>
                              {isSearchingHelp ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="text-center space-y-3">
                                    <div className="h-6 w-6 mx-auto border-3 border-gray-200 border-t-[#FFC300] rounded-full animate-spin" />
                                    <p className="text-sm text-gray-500">Searching...</p>
                                  </div>
                                </div>
                              ) : helpSearchError ? (
                                <div className="text-center py-8">
                                  <p className="text-sm text-gray-600">{helpSearchError}</p>
                                </div>
                              ) : helpArticles.length === 0 ? (
                                <div className="text-center py-8">
                                  <p className="text-sm text-gray-600">No articles found for "{searchQuery}"</p>
                                  <p className="text-xs text-gray-500 mt-2">Try different keywords or browse popular topics below</p>
                                </div>
                              ) : (
                                helpArticles.map((article, index) => (
                                  <motion.button
                                    key={article.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => setSelectedArticle(article)}
                                    whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full p-4 rounded-lg border border-gray-200 transition-all text-left bg-white hover:border-[#FFC300]"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between gap-3">
                                        <span className="text-sm font-semibold leading-snug" style={{ color: "#000814" }}>
                                          {article.title}
                                        </span>
                                        <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                      </div>
                                      {article.snippet && (
                                        <div
                                          className="text-xs text-gray-600 line-clamp-2 leading-relaxed"
                                          dangerouslySetInnerHTML={{
                                            __html: article.snippet.replace(/<em>/g, '<em class="font-medium">'),
                                          }}
                                        />
                                      )}
                                    </div>
                                  </motion.button>
                                ))
                              )}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                Popular Topics
                              </h4>
                              {helpLinks.map((link, index) => (
                                <motion.a
                                  key={index}
                                  href={link.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
                                  whileTap={{ scale: 0.98 }}
                                  className="block w-full p-3 rounded-lg border border-gray-200 transition-all text-left bg-white hover:border-[#FFC300] no-underline"
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-xl">{link.icon}</span>
                                    <span className="text-sm font-medium" style={{ color: "#000814" }}>
                                      {link.title}
                                    </span>
                                    <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                                  </div>
                                </motion.a>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-center text-gray-500 pt-2">
                            Can't find what you're looking for? Chat with us!
                          </p>
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div
                className="border-t border-gray-200 px-6 py-4 bg-white/80"
                style={{
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("home")}
                    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "home" ? "" : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: activeTab === "home" ? "#FFC300" : "transparent",
                    }}
                  >
                    <Home className="h-6 w-6" style={{ color: activeTab === "home" ? "#000814" : "#4B5563" }} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      resetChatView()
                      setActiveTab("chat")
                    }}
                    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "chat" ? "" : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: activeTab === "chat" ? "#FFC300" : "transparent",
                    }}
                  >
                    <MessageCircle
                      className="h-6 w-6"
                      style={{ color: activeTab === "chat" ? "#000814" : "#4B5563" }}
                    />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("news")}
                    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "news" ? "" : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: activeTab === "news" ? "#FFC300" : "transparent",
                    }}
                  >
                    <Newspaper className="h-6 w-6" style={{ color: activeTab === "news" ? "#000814" : "#4B5563" }} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("roadmap")}
                    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "roadmap" ? "" : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: activeTab === "roadmap" ? "#FFC300" : "transparent",
                    }}
                  >
                    <Map className="h-6 w-6" style={{ color: activeTab === "roadmap" ? "#000814" : "#4B5563" }} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("help")}
                    className={`flex flex-col items-center gap-1 px-4 py-2.5 rounded-lg transition-all ${
                      activeTab === "help" ? "" : "hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor: activeTab === "help" ? "#FFC300" : "transparent",
                    }}
                  >
                    <HelpCircle className="h-6 w-6" style={{ color: activeTab === "help" ? "#000814" : "#4B5563" }} />
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
