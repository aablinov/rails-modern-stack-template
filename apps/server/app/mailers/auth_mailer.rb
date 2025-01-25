class AuthMailer < ActionMailer::Base
  def auth_code_mail
    @auth_code = params[:auth_code]

    mail(to: @auth_code.email, subject: "Your auth code")
  end
end