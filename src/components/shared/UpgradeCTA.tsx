import React from "react"
import { Crown, CheckCircle2, Mail } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useUserContext } from "@/context/AuthContext"
import { SUPPORT_EMAIL_ADDRESS } from "@/consts"

const UpgradeCTA = () => {
  const { user } = useUserContext()

  const openMailClient = () => {
    const emailBody = `Hi,

I would like to upgrade to the Pro plan.

Account Details:
- Email: [Your Account Email]
- Current Plan: Basic

Personal Information:
- Position: [Student/PhD/Company Position]

Project Details:
- Purpose: [Educational/Personal]
- Project Description: [Brief description of your non-commercial project/app/idea]

Special Requirements:
[Any additional features or requirements you need]

Looking forward to your response.`

    const mailtoLink = `mailto:${SUPPORT_EMAIL_ADDRESS}?subject=Pro Plan Upgrade Request&body=${encodeURIComponent(emailBody)}`

    const domain = user.email.split("@")[1].toLowerCase()

    const webmailUrls = {
      "gmail.com": `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL_ADDRESS}&su=Pro+Plan+Upgrade+Request&body=`,
      "outlook.com": `https://outlook.live.com/mail/0/deeplink/compose?to=${SUPPORT_EMAIL_ADDRESS}&subject=Pro+Plan+Upgrade+Request&body=`,
      "yahoo.com": `https://compose.mail.yahoo.com/?to=${SUPPORT_EMAIL_ADDRESS}&subject=Pro+Plan+Upgrade+Request&body=`,
    }

    if (webmailUrls[domain as keyof typeof webmailUrls]) {
      window.open(
        webmailUrls[domain as keyof typeof webmailUrls] +
          encodeURIComponent(emailBody),
        "_blank"
      )
    } else {
      window.location.href = mailtoLink
    }
  }

  return (
    <div className="mt-4 border-t pt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro for Enhanced API Access
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Pro Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-3">
                Get enhanced API access with our Pro plan features:
              </p>
              <div className="space-y-2">
                {[
                  "Increased API key limit",
                  "Higher rate limits",
                  "Priority support",
                  "Advanced features access",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-medium">Email Requirements</h3>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
                <p>
                  <strong>Subject:</strong> Pro Plan Upgrade Request
                </p>
                <p>
                  <strong>Required Information:</strong>
                </p>
                <div className="pl-3 text-muted-foreground space-y-3">
                  <div>
                    <p className="font-medium text-foreground">
                      1. Account Details
                    </p>
                    <p>- Your account email</p>
                    <p>- Current plan (Basic)</p>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      2. Personal Information
                    </p>
                    <p>
                      - Your position (Student/Undergraduate/PhD/Company
                      position)
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      3. Project Details
                    </p>
                    <p>
                      - Purpose (Educational/Personal - must be non-commercial)
                    </p>
                    <p>- Detailed project description</p>
                  </div>

                  <div>
                    <p className="font-medium text-foreground">
                      4. Special Requirements
                    </p>
                    <p>- Any additional features or needs</p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={openMailClient}
              className="w-full bg-color-button-bg text-color-button-text hover:bg-color-button-hover"
            >
              Contact Us to Upgrade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpgradeCTA
