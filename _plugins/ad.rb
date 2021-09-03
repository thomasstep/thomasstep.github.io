class AdsInlineTag < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
  end

  def render(context)
    script = %Q{<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
      <!-- Bottom of article ad -->
      <ins class="adsbygoogle"
          style="display:block"
          data-ad-client="ca-pub-1006697357328189"
          data-ad-slot="8609209451"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      <script>
          (adsbygoogle = window.adsbygoogle || []).push({});
    </script>}
    return script;
  end
end
Liquid::Template.register_tag('ad', AdsInlineTag)
