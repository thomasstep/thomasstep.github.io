---
layout: default
title: Slack for HelpDesk Tutorial
---

The first section of this page is a small FAQ followed by instructions for how to install and use Slack for HelpDesk.

**Contact:** If you need any help at all, please feel free to reach out to me (the creator) at thomas@thomasstep.com.

### FAQ

**Q:** Why can't I see any Slack messages whenever tickets are created?

**A:** Make sure that you configure the application to send tickets to your approved Slack channels. You can configure different Slack channels for each team you have setup in HelpDesk and a default Slack channel for tickets that are not assigned to a team with a configured Slack channel. Another potential problem is that the Slack bot has not been invited to the Slack channel. The solution is to configure Slack channels and invite the Slack bot to those channels.

**Q:** Why can I see some HelpDesk tickets in Slack but not all of them?

**A:** If you have configured Slack channels for some of your HelpDesk teams and do not have a default Slack channel configured, then any tickets that are not assigned to one of the configured teams will not be sent to Slack because the application does not know where to send them. The solution is to configure a default Slack channel.

**Q:** Why is the application not accepting my Slack channel as valid?

**A:** Make sure that the Slack channel name that you give is visible to the application (add the Slack bot to the channel). Also make sure that the channel does not have a hash (`#`) in front of it when you enter the name into the application.

### How to Use Slack for HelpDesk

1. After clicking "Install" in the MarketPlace, you should see a popup screen that results in the following (see screenshot). If you do not see a success message, reach out to the developer/support.

    ![Screenshot of LiveChat installation success](/assets/img/slack-livechat-install-success.png)

2. After the application has been installed to your HelpDesk license, go to the app settings page.

    ![Screenshot of HelpDesk app settings page](/assets/img/helpdesk-app-settings.png)

3. Click on settings for Slack for HelpDesk.

    ![Screenshot of Slack for HelpDesk settings button](/assets/img/slack-for-helpdesk-settings-button.png)

4. Authorize the application for use with Slack.

    ![Screenshot of Slack for HelpDesk Slack button](/assets/img/slack-for-helpdesk-calendar-slack-button.png)

5. Refresh Slack for HelpDesk's settings page. You should now see a configuration field for a Slack channel name. Input the Slack channel where you would like Slack for HelpDesk to post ticket updates.

    ![Screenshot of Slack for HelpDesk settings page](/assets/img/slack-for-helpdesk-settings.png)

6. Add Slack for HelpDesk to the configured Slack channel.

    ![Screenshot of Slack for HelpDesk being added to Slack channel](/assets/img/slack-for-helpdesk-add-to-channel.png)

7. Whenever a ticket is created or a reply is posted to a ticket, Slack for HelpDesk will automatically create a message for the ticket and add replies in the thread.

    ![Screenshot of Slack for HelpDesk posting to a Slack channel](/assets/img/slack-for-helpdesk-in-slack.png)

8. Any replies to a ticket thread in Slack will also add that same reply to the HelpDesk ticket.

    ![Screenshot of Slack for HelpDesk posting Slack reply to HelpDesk ticket](/assets/img/slack-for-helpdesk-section-in-helpdesk-ticket.png)
