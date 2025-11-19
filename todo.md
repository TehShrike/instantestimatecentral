## Test on Andrew's site

first locally, then deploy and watch the logs

## legible to llms

page on the site that spits out json-ld or [whatever the json schema stuff](https://claude.ai/chat/21fd360f-c144-4366-8544-f28db5dfef89) is with services and offerings.

## captcha

Need to drop Cloudflare Turnstile or whatever it is into the forms.

## testing improvement

when a form email address says `me+iectest@joshduff.com`, only send to josh@instantestimatecentral.com, don't send it to the company recipients.

## set up Sentry

- [ ] cloudflare worker
- [ ] client forms?

## More info on home page

A description of the site, and the email address josh@instantestimatecentral.com

## Add inobtrusive link

At the bottom right of every form, light text for Instant Estimate Central, linking to instantestimatecentral.com

## Basic contact form validation

- phone number should contain at least 7 digits
- email address should contain an @ followed by a period at some point
