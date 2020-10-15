module Jekyll
  module Tags

    class AllPostUrl < PostUrl

      MATCHER = %r!^(.+/)*(\d+-\d+-\d+)-(.*)$!.freeze

      attr_reader :path, :date, :slug, :name

      def initialize(tag_name, post, tokens)
        super

        @orig_draft = post.strip
        @draft = @orig_draft

        # Jekyll.logger.info(@draft)

        all, @path, @date, @slug = *@orig_draft.sub(%r!^/!, "").match(MATCHER)
        unless all
          raise Jekyll::Errors::InvalidPostNameError,
                "'#{name}' does not contain valid date and/or title."
        end

        basename_pattern = "#{date}-#{Regexp.escape(slug)}\\.[^.]+"
        @name_regex = %r!^_drafts/#{path}#{basename_pattern}|^#{path}_drafts/?#{basename_pattern}!
      end

      def name_matches(other)
        # Jekyll.logger.info("checking drafts")
        return other.relative_path.match(@name_regex)
      end

      def render(context)
        begin
          output = super
          # Jekyll.logger.info(output)
          unless output.empty?
            output
          else
            match_drafts(context)
          end
        rescue Jekyll::Errors::PostURLError
          match_drafts(context)
        end
      end

      def match_drafts(context)
        site = context.registers[:site]
        drafts = site.collections["drafts"]

        drafts.docs.each do |doc|
          # Jekyll.logger.info(relative_url(doc)) if name_matches(doc)
          return relative_url(doc) if name_matches(doc)
        end

        raise Jekyll::Errors::PostURLError, <<~MSG
          Could not find post "#{@orig_draft}" in tag 'all_post_url'.
          Make sure the post exists and the name is correct.
        MSG
      end
    end
  end
end

Liquid::Template.register_tag('all_post_url', Jekyll::Tags::AllPostUrl)
